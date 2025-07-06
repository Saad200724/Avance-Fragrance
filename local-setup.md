# Local MongoDB Setup with Cloudflare Tunnel

## Quick Start Commands (Run on Your Laptop)

### 1. Start MongoDB
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# If not running, start it:
sudo systemctl start mongod  # Linux
# OR
brew services start mongodb-community  # Mac
# OR
mongod  # Direct command
```

### 2. Install Cloudflare Tunnel (cloudflared)
```bash
# Download cloudflared
# For Linux:
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# For Mac:
brew install cloudflared

# For Windows:
# Download from: https://github.com/cloudflare/cloudflared/releases
```

### 3. Login to Cloudflare
```bash
cloudflared tunnel login
```
This will open a browser to authenticate with Cloudflare.

### 4. Create a Tunnel
```bash
# Create a tunnel named "mongodb"
cloudflared tunnel create mongodb

# List tunnels to get the tunnel ID
cloudflared tunnel list
```

### 5. Configure the Tunnel
Create a config file at `~/.cloudflared/config.yml`:
```yaml
tunnel: mongodb
credentials-file: ~/.cloudflared/[TUNNEL-ID].json

ingress:
  - hostname: your-domain.com
    service: tcp://localhost:27017
  - service: http_status:404
```

### 6. Run the Tunnel
```bash
# Start the tunnel
cloudflared tunnel run mongodb
```

### 7. Setup DNS (Optional)
```bash
# Create DNS record (if you have a domain)
cloudflared tunnel route dns mongodb your-domain.com
```

### 8. Alternative: Quick Tunnel (No Domain Required)
```bash
# For quick setup without domain
cloudflared tunnel --url tcp://localhost:27017
```

This will give you a temporary URL like: `https://abc123.trycloudflare.com`

### 9. Update Replit Secret
Use the Cloudflare tunnel URL in your MONGODB_URI:
```
mongodb://abc123.trycloudflare.com:443/AvanceFragrance
```

## Troubleshooting

### MongoDB Not Starting?
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check if port 27017 is in use
netstat -tulpn | grep 27017

# MongoDB logs
sudo journalctl -u mongod
```

### Cloudflare Tunnel Issues?
- Make sure you're logged in: `cloudflared tunnel login`
- Check tunnel status: `cloudflared tunnel list`
- Verify MongoDB is running on port 27017
- Check firewall settings

### Alternative: MongoDB Compass
You can also use MongoDB Compass to connect to your local database and verify data.