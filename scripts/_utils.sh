export WORKSPACE_DIR=$(realpath $(dirname $0)/..)
export WORKSPACE_BUILD_DIR="${WORKSPACE_DIR}/build"

function log() {
  caller=$(basename "$0")
  echo "[${caller%.*}]: $@"
}

function check-cmd() {
  for cmd_name in "$@"; do
    if ! command -v ${cmd_name} >/dev/null; then
      log "Missing required command dependency: $cmd_name"
      exit -1
    fi
  done
}

function check-env() {
  for var_name in "$@"; do
    if [ -z "${!var_name}" ]; then
      log "Missing required environment variable: $var_name"
      exit -1
    fi
  done
}

function workdir() {
  mkdir -p "$1"
  pushd "$1" >/dev/null
}

if [ "${NOTION_REPACKAGED_DEBUG}" = true ]; then
  set -x
fi

export NOTION_EXTRACTED_EXE_NAME="extracted-exe"
export NOTION_EXTRACTED_APP_NAME="extracted-app"
export NOTION_VANILLA_SRC_NAME="vanilla-src"
export NOTION_ENHANCED_SRC_NAME="enhanced-src"

export NOTION_ENHANCER_REPO_URL="https://github.com/notion-enhancer/desktop"
export NOTION_ENHANCER_REPO_NAME="enhancer-desktop-src"

export NOTION_REPACKAGED_HOMEPAGE="https://github.com/jamezrin/notion-repackaged"
export NOTION_REPACKAGED_REPO=${NOTION_REPACKAGED_REPO:-${NOTION_REPACKAGED_HOMEPAGE}}
export NOTION_REPACKAGED_AUTHOR="Notion Repackaged"
