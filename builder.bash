#!/bin/bash

# This script automates the workspace creation and build process for Vulcan systems
# It handles three main systems: Stow, Buffer, and Transfer
# Configuration is read from config.json file

# Get workspace title that will be used across all systems
TEST_TITLE=$(jq -r '.workspaceTitle' ~/Downloads/config.json)

# Helper function to extract configuration values from specific sections in config.json
# Parameters:
#   section: The section name (stow/buffer/transfer)
#   field: The specific field to extract from the section
get_section_config() {
    local section=$1
    local field=$2
    jq -r ".sections.$section.$field" ~/Downloads/config.json
}

# Helper function to extract package-related configurations
# Parameters:
#   section: The section name (stow/buffer/transfer)
#   field: The package field to extract (packageNames/gitCommands)
get_section_packages() {
    local section=$1
    local field=$2
    jq -r ".sections.$section.additionalPackages.$field[]" ~/Downloads/config.json
}


# Display main menu for system selection
function show_menu {
    echo "Select system to build:"
    echo "1. Stow"
    echo "2. Buffer"
    echo "3. Transfer"
    echo "0. Exit"
}

# Main menu loop - handles user input and system selection
while true; do
    show_menu
    read -r choice
    
    case $choice in
        1)
            stow
            rm -f ~/Downloads/config.json
            exit 0
            ;;
        2)
            buffer
            rm -f ~/Downloads/config.json
            exit 0
            ;;
        3)
            transfer
            rm -f ~/Downloads/config.json
            exit 0
            ;;
        0)
            echo "Exiting..."
            rm -f ~/Downloads/config.json
            exit 0
            ;;
        *)
            echo "Invalid option. Please select a number between 1 and 3, or 0 to exit."
            sleep 2
            ;;
    esac
done

# Stow system setup and build function
function stow(){
    local WORKCELL_ID=$(get_section_config "stow" "workcellId")
    local PULL_TAG=$(get_section_config "stow" "mainline")
    local VULCAN_STOW_CONFIG_CR=$(get_section_config "stow" "vsConfigCR")
    local DEPLOYMENT_ARTIFACTS_CR=$(get_section_config "stow" "deployArtifactsCR")
    local ADDITIONAL_PACKAGES=$(get_section_packages "stow" "packageNames")
    local GIT_COMMANDS=$(get_section_packages "stow" "gitCommands")

    cd
    brazil ws create --versionset VulcanStowUnifiedDeploymentArtifacts/development --name workspace-${TEST_TITLE} 
    cd workspace-${TEST_TITLE}
    brazil ws --use --platform AL2_x86_64
    brazil setup platform-support --force
    brazil ws --use -p VulcanStowConfig -p VulcanReorientStowDeploymentArtifacts ${ADDITIONAL_PACKAGES} --${PULL_TAG}
    cd src/VulcanStowConfig
    ${VULCAN_STOW_CONFIG_CR}
    brazil-build local beta NAFulfillment Atlas Lab ${WORKCELL_ID}
    
    # Handle additional packages if they exist
    if [ ! -z "${ADDITIONAL_PACKAGES}" ]; then
        # Loop through each package and its corresponding git command
        local packages=($ADDITIONAL_PACKAGES)
        local commands=($GIT_COMMANDS)
        for i in "${!packages[@]}"; do
            cd "../${packages[$i]}"
            ${commands[$i]}
        done
        cd ../..
        brazil-recursive-cmd --allPackages brazil-build
    else
        cd ../..
    fi

    cd src/VulcanReorientStowDeploymentArtifacts
    ${DEPLOYMENT_ARTIFACTS_CR}

    gnome-terminal -- bash -c "cd workspace-${TEST_TITLE}/src/VulcanReorientStowDeploymentArtifacts && nano docker-compose.yaml"
    while true; do
        read -p "Confirm image tag completed (y/n): " answer
        case $answer in
            [Yy]* ) break;;
            [Nn]* ) gnome-terminal -- bash -c "cd workspace-${TEST_TITLE}/src/VulcanReorientStowDeploymentArtifacts && nano docker-compose.yaml"
            * ) echo "Please confirm when image tag is complete";;
        esac
    done

    brazil-build
    sudo rsync -avzh -O --no-perms --no-owner --no-group --delete --stats --copy-links --exclude /build/private ./build/ /opt/carbon/stow/workflow-${TEST_TITLE}
    gnome-terminal --bash -c "cd /opt/carbon/stow/workflow-${TEST_TITLE}"
}

# Buffer system setup and build function
function buffer(){
    local WORKCELL_ID=$(get_section_config "buffer" "workcellId")
    local PULL_TAG=$(get_section_config "buffer" "mainline")
    local VULCAN_STOW_CONFIG_CR=$(get_section_config "buffer" "vsConfigCR")
    local DEPLOYMENT_ARTIFACTS_CR=$(get_section_config "buffer" "deployArtifactsCR")
    local ADDITIONAL_PACKAGES=$(get_section_packages "buffer" "packageNames")
    local GIT_COMMANDS=$(get_section_packages "buffer" "gitCommands")

    cd
    brazil ws create --versionset VulcanStowUnifiedDeploymentArtifacts/development --name workspace-${TEST_TITLE} 
    cd workspace-${TEST_TITLE}
    brazil ws --use --platform AL2_x86_64
    brazil setup platform-support --force
    brazil ws --use -p VulcanStowConfig -p VulcanStowBufferDeploymentArtifacts ${ADDITIONAL_PACKAGES} --${PULL_TAG}
    cd src/VulcanStowConfig
    ${VULCAN_STOW_CONFIG_CR}
    brazil-build local beta NAFulfillment Atlas Lab ${WORKCELL_ID}
    
    # Handle additional packages if they exist
    if [ ! -z "${ADDITIONAL_PACKAGES}" ]; then
        # Loop through each package and its corresponding git command
        local packages=($ADDITIONAL_PACKAGES)
        local commands=($GIT_COMMANDS)
        for i in "${!packages[@]}"; do
            cd "../${packages[$i]}"
            ${commands[$i]}
        done
        cd ../..
        brazil-recursive-cmd --allPackages brazil-build
    else
        cd ../..
    fi

    cd src/VulcanStowBufferDeploymentArtifacts
    ${DEPLOYMENT_ARTIFACTS_CR}

    gnome-terminal -- bash -c "cd workspace-${TEST_TITLE}/src/VulcanStowBufferDeploymentArtifacts && nano docker-compose.yaml"
    while true; do
        read -p "Confirm image tag completed (y/n): " answer
        case $answer in
            [Yy]* ) break;;
            [Nn]* ) gnome-terminal -- bash -c "cd workspace-${TEST_TITLE}/src/VulcanStowBufferDeploymentArtifacts && nano docker-compose.yaml"
            * ) echo "Please confirm when image tag is complete";;
        esac
    done

    brazil-build
    sudo rsync -avzh -O --no-perms --no-owner --no-group --delete --stats --copy-links --exclude /build/private ./build/ /opt/carbon/stow/workflow-${TEST_TITLE}
    gnome-terminal -- bash -c "cd /opt/carbon/buffer/workflow-${TEST_TITLE}"
}

# Transfer system setup and build function
function transfer(){
    local WORKCELL_ID=$(get_section_config "transfer" "workcellId")
    local PULL_TAG=$(get_section_config "transfer" "mainline")
    local VULCAN_STOW_CONFIG_CR=$(get_section_config "transfer" "vsConfigCR")
    local DEPLOYMENT_ARTIFACTS_CR=$(get_section_config "transfer" "deployArtifactsCR")
    local ADDITIONAL_PACKAGES=$(get_section_packages "transfer" "packageNames")
    local GIT_COMMANDS=$(get_section_packages "transfer" "gitCommands")

    cd
    brazil ws create --versionset VulcanStowUnifiedDeploymentArtifacts/development --name workspace-${TEST_TITLE} 
    cd workspace-${TEST_TITLE}
    brazil ws --use --platform AL2_x86_64
    brazil setup platform-support --force
    brazil ws --use -p VulcanStowConfig -p VulcanInductTransferDeploymentArtifacts ${ADDITIONAL_PACKAGES} --${PULL_TAG}
    cd src/VulcanStowConfig
    ${VULCAN_STOW_CONFIG_CR}
    brazil-build local beta NAFulfillment Atlas Lab ${WORKCELL_ID}
    
    # Handle additional packages if they exist
    if [ ! -z "${ADDITIONAL_PACKAGES}" ]; then
        # Loop through each package and its corresponding git command
        local packages=($ADDITIONAL_PACKAGES)
        local commands=($GIT_COMMANDS)
        for i in "${!packages[@]}"; do
            cd "../${packages[$i]}"
            ${commands[$i]}
        done
        cd ../..
        brazil-recursive-cmd --allPackages brazil-build
    else
        cd ../..
    fi

    cd src/VulcanInductTransferDeploymentArtifacts
    ${DEPLOYMENT_ARTIFACTS_CR}

    while true; do
        read -p "Confirm image tag completed (y/n): " answer
        case $answer in
            [Yy]* ) break;;
            [Nn]* ) gnome-terminal -- bash -c "cd workspace-${TEST_TITLE}/src/VulcanInductTransferDeploymentArtifacts && nano docker-compose.yaml"
            * ) echo "Please confirm when image tag is complete";;
        esac
    done

    brazil-build
    sudo rsync -avzh -O --no-perms --no-owner --no-group --delete --stats --copy-links --exclude /build/private ./build/ /opt/carbon/stow/workflow-${TEST_TITLE}
    gnome-terminal -- bash -c "cd /opt/carbon/induct_transfer/workflow-${TEST_TITLE}"
}