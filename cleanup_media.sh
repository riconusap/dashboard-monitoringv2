#!/bin/bash

# Media cleanup script for unused images
# This script moves unused media files to a backup directory instead of deleting them permanently

echo "🧹 Starting media cleanup process..."

# Create backup directory with timestamp
BACKUP_DIR="unused_media_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📂 Created backup directory: $BACKUP_DIR"

# Count files to process
TOTAL_FILES=$(wc -l < unused_media_files.txt)
echo "📊 Found $TOTAL_FILES unused media files"

# Initialize counter
PROCESSED=0
MOVED=0
ERRORS=0

echo "🚚 Moving unused files to backup directory..."

# Process each unused file
while IFS= read -r file; do
    PROCESSED=$((PROCESSED + 1))
    
    # Show progress every 100 files
    if [ $((PROCESSED % 100)) -eq 0 ]; then
        echo "   Progress: $PROCESSED/$TOTAL_FILES files processed..."
    fi
    
    if [ -f "public/$file" ]; then
        # Create directory structure in backup
        BACKUP_FILE_DIR="$BACKUP_DIR/$(dirname "$file")"
        mkdir -p "$BACKUP_FILE_DIR"
        
        # Move file to backup
        if mv "public/$file" "$BACKUP_DIR/$file" 2>/dev/null; then
            MOVED=$((MOVED + 1))
        else
            echo "❌ Error moving: $file"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done < unused_media_files.txt

echo ""
echo "✅ Cleanup completed!"
echo "📊 Summary:"
echo "   - Total files processed: $PROCESSED"
echo "   - Files moved to backup: $MOVED"
echo "   - Errors encountered: $ERRORS"
echo "   - Backup location: $BACKUP_DIR"

# Check final size
if [ $MOVED -gt 0 ]; then
    echo ""
    echo "💾 Space analysis:"
    echo "   - Backup size: $(du -sh "$BACKUP_DIR" | cut -f1)"
    echo "   - Remaining media size: $(du -sh public/media/ | cut -f1)"
    
    echo ""
    echo "🔄 To restore files if needed:"
    echo "   cp -r $BACKUP_DIR/* public/"
    echo ""
    echo "🗑️  To permanently delete backup (after verification):"
    echo "   rm -rf $BACKUP_DIR"
fi

echo ""
echo "🎉 Media cleanup process completed successfully!"