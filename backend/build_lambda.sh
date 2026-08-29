#!/usr/bin/env bash
# Builds the AWS Lambda deployment package for the canvas backend.
# Installs aarch64 (arm64/Graviton) wheels for the python3.12 Lambda runtime,
# copies the FastAPI app + Mangum handler into terraform-low-cost/build/,
# which the Terraform config zips via archive_file.
#
# Usage: ./build_lambda.sh   (run before `terraform apply`)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TF_DIR="$ROOT/../terraform-low-cost"
BUILD="$TF_DIR/build"
PY_VER="3.12"

rm -rf "$BUILD"
mkdir -p "$BUILD"

echo "==> Installing Linux aarch64 wheels (python $PY_VER)..."
pip3 install \
  --platform manylinux2014_aarch64 \
  --platform manylinux_2_17_aarch64 \
  --platform manylinux_2_28_aarch64 \
  --implementation cp \
  --python-version "$PY_VER" \
  --only-binary=:all: \
  --target "$BUILD" \
  -r "$ROOT/lambda_requirements.txt"

echo "==> Copying application code..."
cp -R "$ROOT/app" "$BUILD/app"
cp "$ROOT/lambda_handler.py" "$BUILD/lambda_handler.py"

# Strip caches and compiled artifacts not needed at runtime
find "$BUILD" -name '__pycache__' -type d -prune -exec rm -rf {} +
find "$BUILD" -name '*.dist-info' -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "==> Lambda package ready at $BUILD"
