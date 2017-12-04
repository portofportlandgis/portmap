# Mapbox GL JS Layer Tree
#### Allow users to interactively organize and reposition different map layers.

#### [Demo](http://dev.gartrellgroup.com/layer-tree/)

### Install:
- [Install Yarn](https://yarnpkg.com/docs/install)
  - Note: You can install yarn via npm if you wish, but it's not ideal - `npm install -g yarn`
- `yarn` to install current set of dependencies
  - Additional dependencies can be installed via `yarn add [packagename]`
- `gulp` to develop locally (includes a local server and watchers on index.html, js, and css files)
- `gulp build` will compile/minify required javascript and default layer-tree.css.


### Dependencies:
- jQuery, jQuery UI Sortable Module, and Font-Awesome are all currently required.
  - jQuery and jQuery UI-Sortable are both included within the compiled `dist/js/scripts.min.js`
  - Font-Awesome CSS should be added in your HTML `<head>`

### Usage:
- #### Create a layer config array:
    - **name** - to be displayed as the layer name in Legend
    - **id** - layer id
    - **source** - layer source
    - **directory** - directory where the layer is apart of
    - **icon** (optional) - path to img src

     ```javascript
     var layers =
     [
         {
             'name': 'Snow Routes',
             'id': 'snow-routes',
             'source': "snowy",
             'directory': 'Community',
         },
         {
             'name': 'Neighborhood',
             'id': 'neighborhood',
             'source': "neighborhood",
             'directory': 'Community',
         },
         {
             'name': 'Airlights',
             'id': 'airlights',
             'source': "airy",
             'directory': 'Environment',
             'icon': 'icons/Electric-Airfield-Lights_15.svg'
         },
         {
             'name': 'Act Twy Edge',
             'id': 'act-twy-edge',
             'source': "airy",
             'directory': 'Environment',
             'icon': 'icons/active-twy-edge_15.svg'
         },
         {
             'name': 'Act Twy Center',
             'id': 'act-twy-center',
             'source': "airy",
             'directory': 'Environment',
             'icon': 'icons/active-twy-center_11.svg'
         }

     ];
     ```

- #### Instantiate Layer Tree
     ```javascript
       map.addControl(new LayerTree({
            layers: layers
       }, 'bottom-left')
    ```

### Notes:
- Initial construction of your own layers (app.js/map.js or whatever) must follow these set of rules:
  - Layers within the same directory **must** be configured/added together
  - For example: Layer A and Layer C can not be of the same directory - if Layer B is also *not* within the same directory and has been added as a mapLayer prior to Layer C being added.
