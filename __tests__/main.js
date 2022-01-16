const shapeToGeoJSON = require("../dist/index");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const testFilesPath = path.join(__dirname, "..", "testFiles");

describe("Errors", () => {
	const errorFolderPath = path.join(testFilesPath, "error");

	beforeEach(async () => {
		await mkdirp(errorFolderPath);
	});
	afterEach(() => {
		rimraf.sync(errorFolderPath);
	});

	it("Should throw an error if no files in directory", async () => {
		await expect(shapeToGeoJSON.parseFolder(errorFolderPath)).rejects.toEqual(new Error("No shapefiles found."));
	});
	it("Should throw an error if no dbf files in directory", async () => {
		await fs.writeFileSync(path.join(errorFolderPath, "test.shp"), "test");
		await expect(shapeToGeoJSON.parseFolder(errorFolderPath)).rejects.toEqual(new Error("No dbf files found."));
	});
	it("Should throw an error if multiple shapefiles in directory", async () => {
		await fs.writeFileSync(path.join(errorFolderPath, "test.shp"), "test");
		await fs.writeFileSync(path.join(errorFolderPath, "testB.shp"), "test");
		await expect(shapeToGeoJSON.parseFolder(errorFolderPath)).rejects.toEqual(new Error("Multiple shapefiles found."));
	});
	it("Should throw an error if multiple dbf in directory", async () => {
		await fs.writeFileSync(path.join(errorFolderPath, "test.shp"), "test");
		await fs.writeFileSync(path.join(errorFolderPath, "test.dbf"), "test");
		await fs.writeFileSync(path.join(errorFolderPath, "testB.dbf"), "test");
		await expect(shapeToGeoJSON.parseFolder(errorFolderPath)).rejects.toEqual(new Error("Multiple dbf files found."));
	});
});

fs.readdirSync(testFilesPath).filter((folder) => !folder.startsWith(".")).forEach((folder) => {
	it("Should parse to correct value when using parseFolder", async () => {
		const folderPath = path.join(testFilesPath, folder);
		const files = fs.readdirSync(folderPath);
		const geoJSON = JSON.parse(fs.readFileSync(path.join(folderPath, files.find((file) => file.endsWith(".geojson"))), "utf8"));
		expect(await shapeToGeoJSON.parseFolder(folderPath)).toEqual(geoJSON);
	});

	it("Should parse to correct value when using parseFile", async () => {
		const folderPath = path.join(testFilesPath, folder);
		const files = fs.readdirSync(folderPath);
		const geoJSON = JSON.parse(fs.readFileSync(path.join(folderPath, files.find((file) => file.endsWith(".geojson"))), "utf8"));
		expect(await shapeToGeoJSON.parseFiles(
			path.join(folderPath, files.find((file) => file.endsWith(".shp"))),
			path.join(folderPath, files.find((file) => file.endsWith(".dbf")))
		)).toEqual(geoJSON);
	});
});
