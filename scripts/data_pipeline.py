import json
import random
import os

# Configuration
OUTPUT_FILE = 'public/data.json'
COUNT = 50

def generate_data():
    """Generates dummy data simulating financial/population metrics."""
    data = []
    
    for i in range(COUNT):
        # Raw value simulation (e.g., stock price 100-1000)
        raw_value = random.uniform(100, 1000)
        
        # Normalization (0 to 1 range for 3D scaling)
        normalized_value = (raw_value - 100) / (1000 - 100)
        
        # 3D Positioning (X/Z for distribution, Y handled by frontend visualizer based on value)
        # We spread them out in a range of -20 to 20 for X and Z
        x = (random.random() - 0.5) * 40
        z = (random.random() - 0.5) * 40
        
        item = {
            "id": i,
            "label": f"Asset {i+1}",
            "value": normalized_value,  # This drives the height & glow
            "raw_value": round(raw_value, 2), # For display text
            "position": [x, 0, z] # Initial position on floor
        }
        data.append(item)
        
    return data

def main():
    # Ensure public directory exists
    if not os.path.exists('public'):
        os.makedirs('public')
        
    data = generate_data()
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
        
    print(f"✅ Generated {COUNT} data points to {OUTPUT_FILE}")
    print("Example Data Point:", json.dumps(data[0], indent=2))

if __name__ == '__main__':
    main()
