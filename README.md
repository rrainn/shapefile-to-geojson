# shapefile-to-geojson

This is a simple package to convert shapefiles to GeoJSON.

## Install

```bash
npm install shapefile-to-geojson
```

## Usage

```js
const shapefileToGeojson = require("shapefile-to-geojson");

const geoJSON = await shapefileToGeojson.parseFiles("./path/to/shapefile.shp", "./path/to/dbf.dbf");

const geoJSON = await shapefileToGeojson.parseFolder("./path/to/files"); // This directory should include 1 `shp` & 1 `dbf` file
```

## License

[MIT License](LICENSE)
