import requests
import subprocess
import sys
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_server_url():
    return os.environ.get('SERVER_URL', 'http://localhost:3001')

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
    try:
        response = requests.get(f'{server_url}/data/{key}')
        if response.status_code == 200:
            return json.loads(response.text)
        else:
            print(f"Error: Key not found or expired (status {response.status_code})")
            return None
    except Exception as e:
        print(f"Error: {e}")
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
