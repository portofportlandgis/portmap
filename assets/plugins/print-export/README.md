## Print Control for Mapbox GL
### PDF and PNG exports for the Port of Portland

##### Originally created as a Mapbox (MB) Control, it's now implemented as a link/button feature.

### Dependencies:
-  Canvas To Blob
-  JSPDF
-  PDF-JS
-  FileSaver
-  HTML2Canvas
-  Mapbox GL

### How To:
- Users pass both the map and a set of options to `PrintControl.prototype.initialize(map, printOptions)`
  ```javascript
    var printOptions = { disclaimer: 'This is my map disclaimer', northArrow: '../path/to/img.svg', defaultTitle: 'My Map' }
  ```
- Add a bootstrap modal - example found in `index.html`
- Ensure [NavigationControl](https://www.mapbox.com/mapbox-gl-js/api/#navigationcontrol), [ScaleControl](https://www.mapbox.com/mapbox-gl-js/api/#scalecontrol), and [LayerTree](https://github.com/TheGartrellGroup/Mapbox-GL-JS-Layer-Tree) are included
- `PrintControl.prototype.initialize(map, options)` initializes the export process and displays a modal
  - Dimensions (always in landscape)
    - 8.5 x 11 inches
    - 11 x 17 inches
  - File Type
    - PNG
    - PDF
- `PrintControl.prototype.exportMap()` fires the modal form input

### Notes:
Per the Port's request:
 - Dimensions are always in landscape
 - Legends are only displayed on the 11 x 17
   -  Layer names and icons are derived from the [Layer Tree](https://github.com/TheGartrellGroup/Mapbox-GL-JS-Layer-Tree)
 - Export/Print will only export the appropriate aspect ratio from the center of the map - any large boundaries that don't fit within the appropriate aspect ratio will be cropped and ignored
 - DIST folder includes minified src

### Development:
 - `yarn`
 - `gulp` to run locally on Port 8000 and livereload
 - `gulp build` to build DIST files (js/css)


