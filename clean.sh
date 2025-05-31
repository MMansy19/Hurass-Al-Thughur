echo "Removing dist directory..."
rm -rf .next/

# Clean npm cache
npm cache clean --force

# Remove directories and files
rm -rf .next
rm -rf node_modules
rm -f package-lock.json
echo "Clean up complete!"

# Install dependencies with legacy peer deps
echo "Installing npm dependencies..."
npm install --legacy-peer-deps
echo "Installation complete!"

# Build the project
echo "Starting build process..."
npm run build
echo "Build process complete!"

# Exit the script
exit 0
