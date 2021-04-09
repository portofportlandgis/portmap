# PortMap
A responsive web map application template using [Bootstrap](https://getbootstrap.com/) and [Mapbox GL](https://www.mapbox.com/mapbox-gl-js/api/)

To get started you need to generate a Mapbox ID. Get your ID by creating a Mapbox account. Insert your Mapbox ID in assets/js/map.js on line 1. 

## What it does:
* Layer tree allows the user to interactively organize and reposition map layers using [Mapbox-GL-JS-Layer-Tree](https://github.com/TheGartrellGroup/Mapbox-GL-JS-Layer-Tree)
* Layer Tree pulls feature symbology automatically via [Font Awesome](http://fontawesome.io/ )
* Supports drawing and editing using [Mapbox Draw API](https://github.com/mapbox/mapbox-gl-draw)
* User can calculate area and length of drawn features using [Mapbox Turf](https://www.mapbox.com/help/define-turf/)
* User can add labels directly to the map as a symbol layer using [Mapbox-GL-JS-Text-Markup](https://github.com/TheGartrellGroup/Mapbox-GL-JS-Text-Markup)
* User can easily find latitude and longitude by clicking on the map 
* Global address search using the [mapbox-gl-geocoder](https://github.com/mapbox/mapbox-gl-geocoder)
* Search JSON Properties with autocomplete and zoom to feature
* Client side Print Export to PNG or PDF with legend: [Print/Export for Mapbox GL](https://github.com/TheGartrellGroup/Mapbox-GL-Print-Export-For-Port)
* Identify multiple features and view attributes in a modal
* Bookmark drop-down list
* Disclaimer modal 
* Scale bar 
* Not included in this repo: Save Views function allows the user to save Layer Tree configuration, Mapbox drawn features, Text Markups, and Zoom and Pitch. All plugins in this repo have code pre-built to work with the Save Views plugin: [Mapbox-GL-JS-save-view](https://github.com/TheGartrellGroup/Mapbox-GL-JS-save-view)


## Demo and Tutorial:
[Demo](https://cdettlaff.github.io./)

I created a [Tutorial](https://opensource.portofportland.io/portmap-tutorial.html) that shows you how to add data to PortMap, and make that data interactive. 

## Quick Preview:

### Layer Tree 
![layers](https://user-images.githubusercontent.com/17071327/114205473-2e94e080-990f-11eb-8ad0-64ace1f12af5.png)

### Identify Features
![identify](https://user-images.githubusercontent.com/17071327/114205484-30f73a80-990f-11eb-90f5-069a8e469fa4.png)

### Draw and Text
![draw](https://user-images.githubusercontent.com/17071327/114205491-32286780-990f-11eb-91e5-b4cb8d33bc8c.png)

### Search JSON with autocomplete
![search](https://user-images.githubusercontent.com/17071327/114205518-38b6df00-990f-11eb-88ba-1070afdd4f4b.png)

### Client Side Printing  
![print](https://user-images.githubusercontent.com/17071327/114205528-3a80a280-990f-11eb-9586-afdbe6a943d7.png)

### Location Tools  
![mobile](https://user-images.githubusercontent.com/17071327/114205505-348ac180-990f-11eb-8735-e084c86a7454.png)

