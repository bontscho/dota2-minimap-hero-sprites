#!/usr/bin/env bash

cd scripts || exit

# Download decompiler
DECOMPILER_FILE=Decompiler
REPO_RELEASES=https://github.com/SteamDatabase/ValveResourceFormat/releases
FILE_NAME=Decompiler-linux-x64.zip
LATEST_RELEASE="0.2.1"
ARTIFACT_URL="${REPO_RELEASES}/download/$LATEST_RELEASE/$FILE_NAME"
DATA_FOLDER="data"
# pak01 that contains minimap sheet
PACK_PATH="$HOME/.local/share/Steam/steamapps/common/dota 2 beta/game/dota/pak01_dir.vpk"
MINIMAP_FILE_PREFIX="minimap_hero_sheet_"
MINIMAP_FILEPATH="materials/vgui/hud/$MINIMAP_FILE_PREFIX"


# Download new heroes files if STEAM_API_KEY env variable is available
if [[ -n "$STEAM_API_KEY" ]]; then
  HERO_URL="https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?language=en_us&key=$STEAM_API_KEY"
  echo "Download new heroes.json file"
  if test -x "$(which jq)"; then
    curl --location --silent --request GET "$HERO_URL" | jq > ../src/heroes.json
  else
    echo "jq is not available, format heroes.json manually"
    curl --location --silent --request GET "$HERO_URL" > ../src/heroes.json
  fi
fi

# Ensure folder exists
mkdir -p $DATA_FOLDER

# Download decompiler if not available
if [ ! -f "${DATA_FOLDER}/${DECOMPILER_FILE}" ]; then
  echo "$ARTIFACT_URL"
  echo "Downloading new Decompiler"
  curl -L "$ARTIFACT_URL" > "${DATA_FOLDER}/${FILE_NAME}"
  unzip -o "${DATA_FOLDER}/${FILE_NAME}" -d $DATA_FOLDER
  chmod +x "${DATA_FOLDER}/${DECOMPILER_FILE}"
fi

# Extract latest texture files
"./${DATA_FOLDER}/${DECOMPILER_FILE}" -i "$PACK_PATH" -e "txt" -f "scripts/mod_textures.txt" -o $DATA_FOLDER
cp "$DATA_FOLDER/scripts/mod_textures.txt" ../src

# Extract sprite file
"./${DATA_FOLDER}/${DECOMPILER_FILE}" -i "$PACK_PATH" -e "vtex_c" -f $MINIMAP_FILEPATH -o $DATA_FOLDER
FILE_INPUT=$(find $DATA_FOLDER -name "${MINIMAP_FILE_PREFIX}*.vtex_c")

# Decompile vtex_c file to png
echo "File input $FILE_INPUT"
"./${DATA_FOLDER}/${DECOMPILER_FILE}" -i $FILE_INPUT -e "vtex_c" -o ../assets/images/minimap_hero_sheet.png
