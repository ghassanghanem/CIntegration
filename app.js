const mapboxAccessToken = 'pk.eyJ1IjoiZ2hhc3NhbmdoYW5lbSIsImEiOiJjbGVrbGpwZHQwbWt6M3JucHlweXIwYnM4In0.54_EfTPnnFP-6y7JXNmdRw'; 
const mapboxStyle = 'mapbox://styles/mapbox/light-v11';
const mapboxTerrainUrl = 'https://api.mapbox.com/v4/mapbox.terrain-rgb';

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,
    geocoder: true,
    homeButton: true,
    infoBox: true,
    navigationHelpButton: true,
    sceneModePicker: true,
    timeline: true,
    animation: true,
    fullscreenButton: true,
    imageryProvider: new Cesium.MapboxImageryProvider({
        mapId: mapboxStyle,
        accessToken: mapboxAccessToken,
    }),
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: mapboxTerrainUrl,
        requestVertexNormals: true,
        requestWaterMask: true,
        accessToken: mapboxAccessToken,
    }),
});

const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId('1579192')
    })
);

viewer.zoomTo(tileset);

// Store the initial view
let initialView;

viewer.zoomTo(tileset).then(() => {
    initialView = {
        position: viewer.camera.position.clone(),
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
    };
});

// Update the home view when the home button is clicked
viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
    e.cancel = true;
    if (initialView) {
        viewer.camera.flyTo({
            destination: initialView.position,
            orientation: {
                heading: initialView.heading,
                pitch: initialView.pitch,
                roll: initialView.roll,
            },
        });
    }
});

viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date('2023-03-15T10:00:00Z'));

viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.shadowMap.enabled = true;
viewer.scene.highDynamicRange = true;
viewer.scene.sun.position = Cesium.SunPosition.compute(viewer.clock.currentTime);
viewer.scene.sun.intensity = 2.0;
viewer.scene.light.color = new Cesium.Color(0.8, 0.8, 0.8, 1.0);
viewer.scene.light.intensity = 0.6;
