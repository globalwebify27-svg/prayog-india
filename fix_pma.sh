#!/bin/bash
echo "Downloading fresh phpMyAdmin..."
curl -sS -o /tmp/pma.zip https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip

echo "Extracting..."
cd /tmp
unzip -q pma.zip

echo "Backing up broken phpMyAdmin..."
mv /Applications/XAMPP/xamppfiles/phpmyadmin /Applications/XAMPP/xamppfiles/phpmyadmin_broken

echo "Installing fresh phpMyAdmin..."
mv phpMyAdmin-5.2.1-all-languages /Applications/XAMPP/xamppfiles/phpmyadmin

echo "Restoring your configuration file..."
cp /Applications/XAMPP/xamppfiles/phpmyadmin_broken/config.inc.php /Applications/XAMPP/xamppfiles/phpmyadmin/ 2>/dev/null || echo "No custom config found, using default."

echo "Cleaning up..."
rm /tmp/pma.zip

echo ""
echo "✅ Done! You can now refresh phpMyAdmin in Safari."
