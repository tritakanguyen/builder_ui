import requests
import subprocess
import sys
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_server_url():
    return os.environ.get('SERVER_URL')

def save_checkpoint(index, key):
    with open(f'/tmp/autobuild_checkpoint_{key}.txt', 'w') as f:
        f.write(str(index))

def load_checkpoint(key):
    try:
        with open(f'/tmp/autobuild_checkpoint_{key}.txt', 'r') as f:
            return int(f.read().strip())
    except:
        return 0

def clear_checkpoint(key):
    try:
        os.remove(f'/tmp/autobuild_checkpoint_{key}.txt')
    except:
        pass

def get_data(key, server_url=None):
    if server_url is None:
        server_url = get_server_url()
    if not server_url:
        logging.error("SERVER_URL environment variable not set")
        return None
    try:
        url = f'{server_url}/data/{key}'
        logging.info(f"Fetching data from: {url}")
        response = requests.get(url)
        if response.status_code == 200:
            return json.loads(response.text)
        elif response.status_code == 404:
            logging.error(f"Key '{key}' not found or expired. Keys expire after 30 minutes or are consumed after first use.")
            return None
        else:
            logging.error(f"Server returned status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        logging.error(f"Failed to connect to server: {e}")
        return None

def execute_commands(commands, key, start_index=0):
    i = start_index
    while i < len(commands):
        cmd = commands[i]
        logging.info(f"[{i+1}/{len(commands)}] Executing: {cmd}")
        result = subprocess.run(cmd, shell=True)
        
        if result.returncode != 0:
            logging.error(f"Command failed with exit code {result.returncode}")
            save_checkpoint(i, key)
            response = input("Command failed. Fix the issue manually and press Enter to continue, or 'q' to quit: ")
            if response.lower() == 'q':
                logging.info(f"Workflow paused at step {i+1}. Run with same key to resume.")
                sys.exit(1)
        
        save_checkpoint(i + 1, key)
        i += 1

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python autobuild.py <key>")
        sys.exit(1)
    
    key = sys.argv[1]
    server_url = get_server_url()
    data = get_data(key, server_url)
    
    if data and 'commands' in data:
        start_index = load_checkpoint(key)
        if start_index > 0:
            logging.info(f"Resuming from checkpoint: step {start_index + 1}")
        logging.info("Executing workflow commands...")
        execute_commands(data['commands'], key, start_index)
        clear_checkpoint(key)
        logging.info("Workflow execution completed!")
    else:
        logging.error("Failed to retrieve commands")
        sys.exit(1)
