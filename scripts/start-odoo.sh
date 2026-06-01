#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../odoo"
docker compose up -d
echo "Odoo starting at http://localhost:8069"
