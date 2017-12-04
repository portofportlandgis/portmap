'use strict';
//@implements {IControl}
function LayerTree(options) {
    this.options = options;
    this.sources = [];
}

LayerTree.prototype.onAdd = function(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    //layer manager bounding box
    var layerBox = document.createElement('div');
    layerBox.className = 'mapboxgl-ctrl legend-container';

    //legend ui
    var legendDiv = document.createElement('div');
    legendDiv.id = 'mapboxgl-legend';

    layerBox.appendChild(legendDiv);
    this._container.appendChild(layerBox);

    this.getLayers(map);
    return this._container;
}

LayerTree.prototype.onRemove = function() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
}

//get layers once they start loading
LayerTree.prototype.getLayers = function(map) {
    var _this = this;
    var layers = _this.options.layers;
    var sourceCollection = _this.sources;
    var numSources = [];

    map.sourceCollection = sourceCollection;
    map.lyrs = layers;

    for (var s = layers.length - 1; s >= 0; s--) {
        if (layers[s].hasOwnProperty('source') && $.inArray(layers[s].source, numSources) === -1) {
            numSources.push(layers[s].source);
        } else if (layers[s].hasOwnProperty('layerGroup')) {
            //check layerGroups for composite layer sources
            var layerGroup = layers[s].layerGroup;
            for (var c = layerGroup.length - 1; c >= 0; c--) {
                if ($.inArray(layerGroup[c].source, numSources) === -1) {
                    numSources.push(layerGroup[c].source);
                }
            };
        }
    };

    var loadingSource = function(e) {
        var lyrGroupSource;
        var lyr = layers.filter(function(layer) {
            if (layer.hasOwnProperty('source')) {
                return layer.source === e.sourceId;
            } else if (layer.hasOwnProperty('layerGroup')) {
                for (var indx = layer.layerGroup.length - 1; indx >= 0; indx--) {
                    if (layer.layerGroup[indx].source === e.sourceId) {
                        lyrGroupSource = layer.layerGroup[indx].source;
                        return lyrGroupSource;
                    }
                }
            }
        });

        if (lyr.length) {
            for (var l = lyr.length - 1; l >= 0; l--) {
                if (lyr[l] === lyr[lyr.length-1]) {
                    if (lyrGroupSource !== undefined || lyrGroupSource !== '' || lyr.hasOwnProperty('source')) {
                        var mapLyrObj = map.getSource(e.sourceId);
                        sourceCollection.push(mapLyrObj);
                   }
                }
                _this.appendLayerToLegend(map, mapLyrObj, lyr[l]);
            };
        }

        if (sourceCollection.length === numSources.length) {
            map.off('sourcedataloading', loadingSource)
            //_this.loadBasemaps(map, _this.options.basemaps);
            _this.enableSortHandler(map, _this.loadComplete(_this, map, sourceCollection));
        }
    }

    map.on('sourcedataloading', loadingSource);
}

//callback to append layer to legend
LayerTree.prototype.appendLayerToLegend = function(map, mapLyrObj, lyr) {
    var legendId = '#mapboxgl-legend';
    var directoryName = lyr.directory;
    var directoryId = directoryName.replace(/\s+/g, '-').toLowerCase();

    var layerName = lyr.name;
    var layerId = lyr.id;
    var layerDiv = "<div id='" + layerId + "' class='layer-item grb'><input class='toggle-layer' type='checkbox'><span class='name'>" + layerName + "</span></div>";

    if ($('#' + directoryId).length) {
        if (!$('#' + layerId).length) {
            $('#' + directoryId).append(layerDiv);
        }
    } else {
        $(legendId).append("<div id='" + directoryId + "' class='layer-directory grb'><div class='directory-name'>" + directoryName + "<i class='fa toggle-directory-open' aria-hidden='true'</i></div></div>");
        $('#' + directoryId).append(layerDiv);
    }

    //add layer-group class to layerGroup 'layer'
    var inputElm = $('#'+layerId+ ' .toggle-layer');
    var layerElm = $('#')
    if (lyr.hasOwnProperty('layerGroup') && !inputElm.hasClass('layer-group')) {
        inputElm.addClass('layer-group');

        var childLayers = lyr.layerGroup;
        var childIds = [];
        for (var i = childLayers.length - 1; i >= 0; i--) {
            childIds.push(childLayers[i].id);
            $('#' + layerId).append("<div id='" + childLayers[i].id + "' class='child-layer'><span class='child-name'>" + childLayers[i].name + "</span></div>");
        };
        //add childLayer ids to elm
        $('#'+layerId).attr('childLayers', childIds);
        inputElm.attr('childLayers', childIds);
    }
}

LayerTree.prototype.loadBasemaps = function(map, basemaps) {
    var legendId = '#mapboxgl-legend';

    for (var i = basemaps.length - 1; i >= 0; i--) {
        var baseDir = basemaps[i].directory;
        var baseDirID = baseDir.replace(/\s+/g, '-').toLowerCase();

        var mapStyle = basemaps[i].name;
        var mapStyleID = basemaps[i].id;
        var mapStyleSource = basemaps[i].source;

        var baseDiv = "<div id='" + mapStyleID + "' class='layer-item grb'><input class='toggle-basemap' type='radio' base-style='" + mapStyleSource + "'><span class='name'>" + mapStyle + "</span></div>";

        if ($('#' + baseDirID).length) {
            $('#' + baseDirID).append(baseDiv);
        } else {
            $(legendId).append("<div id='" + baseDirID + "' class='layer-directory grb'><div class='directory-name'>" + baseDir + "</div></div>");
            $('#' + baseDirID).append(baseDiv);
        }

        //rough logic to get map style param
        var styleSubstring = basemaps[i].source.replace('mapbox://styles','');
        if (map.style.stylesheet.sprite.indexOf(styleSubstring) > -1) {
            $('#'+ mapStyleID +' input').prop("checked", true);
        }

        $('body').on('click', '.toggle-basemap', function() {
            var elmId = $(this).parent().attr('id');
            var clickedMap = $('#'+elmId + ' input[type=radio]');
            $('.toggle-basemap').prop('checked', false);

            clickedMap.prop('checked', true);

            var mapSources = Object.entries(map.getStyle().sources);
            var mapLayers = map.nonCompositeLayers;

            map.on('style.load', function() {
                var keepLayers = [];
                for (var i = mapLayers.length - 1; i >= 0; i--) {
                    for (var j = mapSources.length - 1; j >= 0; j--) {
                        if (mapSources[j][0] !== 'composite') {
                            if (!map.getSource(mapSources[j][0])) {
                                map.addSource(mapSources[j][0], mapSources[j][1].url);
                            }
                            map.addLayer()
                        }
                        if (mapSources[j] !== 'composite' && mapSources[j] === mapLayers[i].source) {
                            keepLayers.push(mapLayers[i]);
                        }
                    };
                };
            });
        });
    };
}

LayerTree.prototype.updateLegend = function(map, sourceCollection, lyrs) {
    var layers = map.nonCompositeLayers;
    var arrayObj = [];
    var directoryOptions = this.options.directoryOptions

    //update legend once layers are fully loaded
    for (var i = lyrs.length - 1; i >= 0; i--) {
        var id = lyrs[i].id;
        var lyrElm = '#' + id;
        var dir = $(lyrElm).parent('.layer-directory');
        var lyrArray = dir.children('.layer-item');

        var layerIndex = findLayerIndex(layers, lyrs, i);
        $(lyrElm).attr('initial-index', layerIndex);

        sortLoadedLayers(lyrArray, dir);
        visible(map, id, lyrElm, lyrs);
        addIcons(map, id, lyrs, lyrElm);
    }

    $('body').on('click', '.toggle-layer', function() {
        var lyrId = $(this).parent().attr('id');


        //layerGroups
        if ($(this).hasClass('layer-group')) {
            var $input = $(this);
            var childIds = $input.attr('childLayers').split(',');
            for (var i = childIds.length - 1; i >= 0; i--) {
                if ($input.is(':checked')) {
                    map.setLayoutProperty(childIds[i], 'visibility', 'visible');
                } else {
                    map.setLayoutProperty(childIds[i], 'visibility', 'none');
                }
            };
        //regular layers
        } else {
            if ($(this).is(':checked')) {
                map.setLayoutProperty(lyrId, 'visibility', 'visible');

                map.on('render', function(e) {
                    var zoomLevel = map.getZoom();
                    zoomHandler(lyrId, zoomLevel);
                })
            } else {
                map.setLayoutProperty(lyrId, 'visibility', 'none');
            }
        }
    });

    $('.directory-name').click(function() {
        $(this).parent().find('.layer-item').toggle();
        $(this).find('i').toggleClass('toggle-directory-open toggle-directory-close');
    });

    sortLoadedDirectories(directoryOptions);

    //sort legends based on initial on layer index
    function sortLoadedLayers(lyrArray, dir) {
        lyrArray.sort(function(a, b) {
            var aVal = parseInt(a.getAttribute('initial-index')),
                bVal = parseInt(b.getAttribute('initial-index'));
            return bVal - aVal;
        });

        lyrArray.detach().appendTo(dir);
    }

    //activate checkbox if layer is visible and add ghost class if neccessary
    function visible(map, id, lyrElm, lyrs) {
        if (map.getLayer(id) === undefined) {
            //check for layerGroups
            var layerGroup = $.grep(lyrs, function(i) {
                return id === i.id;
            });

            if (layerGroup.length) {
                var lyrGroup = layerGroup[0].layerGroup;
                for (var i = lyrGroup.length - 1; i >= 0; i--) {
                    adjustLayoutProperties(lyrGroup[i].id, lyrElm, layerGroup);
                }
            }
        } else {
            adjustLayoutProperties(id, lyrElm);
        }

        function adjustLayoutProperties(id, lyrElm, layerGroup) {
            var visibility = map.getLayoutProperty(id, 'visibility');
            var zoomLevel = map.getZoom();


            if (lyrGroup === undefined) {
                if (visibility !== 'none') {
                    $(lyrElm + ' input').prop("checked", true);
                }
                //toggle ghost class
                zoomHandler(id, zoomLevel)
            } else {
                if (visibility !== 'none') {
                    var grpId = layerGroup[0].id;
                    $('#'+grpId + ' input').prop("checked", true);

                    //toggle ghost class
                    zoomHandler(id, zoomLevel, grpId);
                }
            }
        }
    }

    //assign legend icons
    function addIcons(map, id, lyrs, lyrElm) {
        var obj = $.grep(lyrs, function(i) {
            return id === i.id;
        });

        if (obj.length) {
            var mapLayer = map.getLayer(id);
            if (mapLayer !== undefined) {
                var mapSource = map.getSource(obj[0].source);

                //is there a default icon in the config?
                if (!obj[0].hasOwnProperty('icon')) {
                    if (mapLayer.type === 'fill' && mapSource.type === 'geojson') {
                        var faClass = geojsonFill(id);
                    } else if (mapLayer.type === 'line' && mapSource.type === 'geojson') {
                        var faClass = geojsonLine(id);
                    } else if (mapLayer.type === 'circle' && mapSource.type === 'geojson') {
                        var faClass = geojsonCircle(id);
                    }
                    $(lyrElm + ' span.name').before(faClass);
                } else {
                    if (obj[0].icon !== false) {
                        var imgClass = "<img src='" + obj[0].icon + "' alt='" + obj[0].id + "'>";
                        $(lyrElm + ' span.name').before(imgClass);
                    }
                }
            } else if (obj[0].hasOwnProperty('layerGroup')) {
                if (obj[0].hasOwnProperty('icon')) {
                    var imgClass = "<img src='" + obj[0].icon + "' alt='" + obj[0].id + "'>";
                    $(lyrElm + ' span.name').before(imgClass);
                }

                var layerGroup = obj[0].layerGroup;
                for (var i = 0; i < layerGroup.length; i++) {
                    var mapSource = map.getSource(layerGroup[i].source);
                    var id = layerGroup[i].id;
                    var mapLayer = map.getLayer(id);

                    if (!layerGroup[i].hasOwnProperty('icon')) {
                        if (mapLayer.type === 'fill' && mapSource.type === 'geojson') {
                            var faClass = geojsonFill(id);
                        } else if (mapLayer.type === 'line' && mapSource.type === 'geojson') {
                            var faClass = geojsonLine(id);
                        } else if (mapLayer.type === 'circle' && mapSource.type === 'geojson') {
                            var faClass = geojsonCircle(id);
                        }
                        $('#' + id + ' span.child-name').before(faClass);
                    } else {
                        if (layerGroup[i].icon !== false) {
                            var imgClass = "<img src='" + layerGroup[i].icon + "' alt='" + id + "'>";
                            $('#' + id + ' span.child-name').before(imgClass);
                        }
                    }
                };
            }
        }

        function geojsonFill(id) {
            var fillColor = map.getPaintProperty(id, 'fill-color') || '';
            var fillOpacity = map.getPaintProperty(id, 'fill-opacity') || '';
            var polyOutline = map.getPaintProperty(id, 'fill-outline-color') || '';
            return "<i class='fa geojson-polygon' aria-hidden='true' style='color:"+ fillColor +";opacity:"+ fillOpacity+";-webkit-text-stroke: 1px "+ polyOutline+";'></i>";
        }

        function geojsonLine(id) {
            var lineColor = map.getPaintProperty(id, 'line-color') || '';

            if (map.getPaintProperty(id, 'line-dasharray')) {
                return "<i class='fa geojson-line-dashed' aria-hidden='true' style='color:"+ lineColor +";'></i>";
            } else {
                return "<i class='fa geojson-line-solid' aria-hidden='true' style='color:"+ lineColor +";'></i>";
            }
        }

        function geojsonCircle(id) {
            var fillColor = map.getPaintProperty(id, 'circle-color') || '';
            var circleOutline = map.getPaintProperty(id, 'circle-stroke-color') || '';
            return "<i class='fa geojson-circle' aria-hidden='true' style='color:"+ fillColor +";-webkit-text-stroke: 1px "+ circleOutline+";'></i>";
        }
    }

    //sort initial loading of directories
    function sortLoadedDirectories(directoryOptions) {
        var directoryOptions = directoryOptions
        var layerDirectories = $('.layer-directory');
        var legend = $('#mapboxgl-legend');

        $.each(layerDirectories, function(i) {

            //get the highest index value for each directory
            var highestIndex = $(this).children('.layer-item:first');
            var indexVal = highestIndex.attr('initial-index') * 10;

            //apply value to directory
            $(this).attr('initial-index', indexVal);

            //initial toggle open or close of directory
            if (directoryOptions && directoryOptions.length) {
                var dirId = this.id
                var dir = $.grep(directoryOptions, function(i) {
                    return dirId === i.name.replace(/\s+/g, '-').toLowerCase();
                });

                if (dir.length && dir[0].hasOwnProperty('open') && dir[0].open === false) {
                    $('#'+dirId + '> .directory-name').click();
                }
            }

        })

        sortLoadedLayers(layerDirectories, legend);
    }

}

//callback to activate jquery-ui-sortable
LayerTree.prototype.enableSortHandler = function(map) {
    //sortable directories
    $('#mapboxgl-legend').sortable({
        items: '.layer-directory',
        stop: function(e, ui) {

            var orderArray = [];
            var layers = map.nonCompositeLayers;
            var newDirOrder = ui.item.parent().sortable('toArray');

            //this loop starts at the directory above the lowest indexed
            for (var i = newDirOrder.length - 2; i >= 0; i--) {
                var dir = newDirOrder[i];
                var layerArray = $('#' + dir).sortable('toArray');

                for (var j = layerArray.length - 1; j >= 0; j--) {
                    var lyr = layerArray[j];
                    var childLayers = $('#' + lyr).attr('childLayers');

                    if (childLayers !== undefined) {
                        var children = childLayers.split(',');
                    }

                    if (children && children.length) {
                        for (var k = children.length - 1; k >= 0; k--) {
                            map.moveLayer(children[k]);
                        };
                        children = false;
                    } else {
                        map.moveLayer(lyr);
                    }
                };
            }

            for (var i = 0; i < map.drawingLayers.length; i++) {
                map.moveLayer(map.drawingLayers[i].id)
            };
        }
    });

    //sortable layers in a directory
    $('.layer-directory').sortable({
        items: '.layer-item',
        stop: function(e, ui) {
            /**
            IMPORTANT: mapbox-gl ordering is dictated by
            bottom-most layers appearing the highest on map!

            Ex. layers = [ 'foo', 'bar']
            'bar' is going to show on top of 'foo'
            **/

            var layers = map.nonCompositeLayers;
            var orderArray = [];
            var currentLayerOrder = ui.item.parent().sortable('toArray').reverse();

            // copy array as we're modifying the original array in a for-loop
            var newLayerOrder = currentLayerOrder.slice(0);

            // check for childLayers and reorder
            for (var n = currentLayerOrder.length - 1; n >= 0; n--) {
                var lyr = currentLayerOrder[n];
                var childLayers = $('#' + lyr).attr('childLayers');

                if (childLayers !== undefined) {
                    var children = childLayers.split(',').reverse();
                }

                if (children && children.length) {
                    var parentIndexOrder = newLayerOrder.indexOf(lyr);

                    // insert children layers to original location of parent
                    newLayerOrder.splice.apply(newLayerOrder, [parentIndexOrder, 0].concat(children));
                    var newParentOrder = newLayerOrder.indexOf(lyr);

                    //remove parent after its order changes
                    newLayerOrder.splice(newParentOrder, 1);
                    children = false;
                }
            }

            // now we have an updated newLayerOrder
            for (var i = newLayerOrder.length - 1; i >= 0; i--) {

                var layerIndex = findLayerIndex(layers, newLayerOrder, i);

                if (layerIndex !== undefined) {
                    var obj = {
                        'originalOrder': layerIndex,
                        'newOrder': i,
                        'id': newLayerOrder[i],

                    }
                    orderArray.push(obj);
                }
            };

            //move layer order
            orderArray.sort(function(a, b) {
                if (b.newOrder > a.newOrder) {
                    map.moveLayer(a.id, b.id);
                } else  {
                    map.moveLayer(b.id, a.id);
                }
            })

            for (var i = 0; i < map.drawingLayers.length; i++) {
                map.moveLayer(map.drawingLayers[i].id)
            };
        }
    });
}

//callback to check if map is loaded
LayerTree.prototype.loadComplete = function(_that, map, sourceCollection) {

    var mapLoaded = function() {
        if (map.loaded()) {

            map.nonCompositeLayers = map.getStyle().layers.filter(function(lyr) {
                return (lyr.source && lyr.source !== 'composite')
            })

            map.drawingLayers = map.nonCompositeLayers.filter(function(lay) {
                return (lay.source.indexOf('mapbox-gl-draw') > -1)
            })

            for (var i = 0; i < map.drawingLayers.length; i++) {
                map.moveLayer(map.drawingLayers[i].id)
            };

            _that.updateLegend(map, sourceCollection, _that.options.layers);
            $('.mapboxgl-ctrl.legend-container').trigger('show');
            $('.mapboxgl-ctrl.legend-container').show();
            map.off('render', mapLoaded)
        }
    }

    var zoomEnd = function(e) {
        var zoomLevel = map.getZoom();
        var lyrsArray = [];
        for (var i = map.lyrs.length - 1; i >= 0; i--) {
            // layerGroups need the same min max zoom settings
            if (map.lyrs[i].hasOwnProperty('layerGroup')) {
                var lyrID = map.lyrs[i].layerGroup[0].id;
                var parentID = map.lyrs[i].id;
            } else {
                var lyrID = map.lyrs[i].id;
                parentID = false
            }

            zoomHandler(lyrID, zoomLevel, parentID);
        }
    }

    map.on('render', mapLoaded);
    map.on('zoomend', zoomEnd);
}

//find layer index location
function findLayerIndex(allLayers, ourLayers, indexVal) {
    var index = -1;
    for (var i = allLayers.length - 1; i >= 0; i--) {
        if (typeof ourLayers[indexVal] == 'object' && ourLayers[indexVal] !== null) {
            //layerGroup logic
            if (ourLayers[indexVal].hasOwnProperty('layerGroup')) {
                var lyr = ourLayers[indexVal];
                for (var j = lyr.layerGroup.length - 1; j >= 0; j--) {
                    if (allLayers[i].id === lyr.layerGroup[j].id) {
                        index = i;
                        break
                    }
                };
            //regular layers
            } else if (allLayers[i].id === ourLayers[indexVal].id) {
                index = i;
                break
            }
        } else {
            if (allLayers[i].id === ourLayers[indexVal]) {
                index = i;
                break
            }
        }

    };

    return index;
}

function zoomHandler(lyrID, zoomLevel, parentID) {
    var lyr = map.getLayer(lyrID);

    if (parentID) {
        lyrID = parentID;
    }

    function toggleGhost (g) {
        g === 'off' ? $('#'+lyrID).removeClass('ghost') : $('#'+lyrID).addClass('ghost');
    }

    if (typeof lyr !== "undefined" && (lyr.minzoom || lyr.maxzoom) && $('#'+ lyrID + ' .toggle-layer').prop('checked')) {
        if (lyr.minzoom && lyr.maxzoom) {
            zoomLevel >= lyr.minzoom && zoomLevel <= lyr.maxzoom ? toggleGhost('off') : toggleGhost('on')
        } else if (lyr.minzoom) {
            zoomLevel >= lyr.minzoom ? toggleGhost('off') : toggleGhost('on')
        } else if (lyr.maxzoom) {
            zoomLevel <= lyr.maxzoom ? toggleGhost('off') : toggleGhost('on')
        } else {
            toggleGhost('on');
        }
    }
}
