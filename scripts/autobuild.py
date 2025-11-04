import requests
import sys

def get_data(key, server_url='http://localhost:3001'):
    try:
        response = requests.get(f'{server_url}/data/{key}')
        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Error: Key not found or expired (status {response.status_code})")
            print(f"Please generate the key again.")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python autobuild.py <key>")
        sys.exit(1)
    
    key = sys.argv[1]
    data = get_data(key)
    
    if data:
        print("Retrieved commands:")
        print(data)
    else:
        print("Failed to retrieve data")
