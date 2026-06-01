#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../odoo"
docker compose down
echo "Odoo stopped."
