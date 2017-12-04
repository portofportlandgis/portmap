'use strict';
// in inches
var default_height = 7.4,
    large_height = 9.6,
    legend_width = 2.25,
    CANVAS_RATIO = '';

const DEFAULT_HEIGHT = default_height * 72;
const DEFAULT_WIDTH = 792;
const DEFAULT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT;

const LARGE_HEIGHT = large_height * 72;
const LARGE_WIDTH = 1224 - (legend_width * 72);
const LARGE_RATIO = LARGE_WIDTH / LARGE_HEIGHT;

const PT_RATIO = 15 / 11;

const MARGINS = 12;
const BORDER_MARGINS = 9;

function PrintControl() {}

PrintControl.prototype.initialize = function(map, options) {
    var _this = this;

    _this._map = map;
    _this.options = options;

    if ($('.cropper-preview-container').length === 0) {
        _this._cropperContainer = document.createElement('div');
        _this._cropperContainer.className = 'cropper-preview-container';
        _this._cropperContainer.style.display = 'none';

        _this._exportView = document.createElement('img');
        _this._exportView.id = 'export-view';

        _this._cropperContainer.appendChild(_this._exportView);
        document.querySelector('#map-print-modal').appendChild(_this._cropperContainer);

        _this.watchDimensions();
    }

    _this.createCropper();
}


PrintControl.prototype.watchDimensions = function(map) {
    var _this = this;

    $(document).ready(function() {
        $('input[type=radio][name=dimensions]').change(function() {
            if (this.value === 'default') {
                _this.cropper.cropper('setAspectRatio', DEFAULT_RATIO)
            } else if (this.value == 'large') {
                _this.cropper.cropper('setAspectRatio', LARGE_RATIO)
            }
        });
    });
}

PrintControl.prototype.createCropper = function(e) {
    if (this.cropper && this.cropper.cropper()) {
        this.cropper.cropper('destroy');
    }

    var exportView = $('#export-view');
    exportView.attr('src', map.getCanvas().toDataURL());
    exportView.css('max-width', '100%')

    this.cropper = exportView.cropper({
        zoomable: false,
        zoomOnWheel: false,
        minContainerHeight: 300,
        minContainerWidth: 568,
        autoCropArea: 0.99,
        aspectRatio: DEFAULT_RATIO,
        cropBoxResizable: false,
        dragMode: 'none'
    })
}

PrintControl.prototype.exportMap = function(e) {
    var _this = this;

    var type = $("form#print-form .format input[type='radio']:checked").val();
    var size = $("form#print-form .size input[type='radio']:checked").val();
    var mapText = {
        title: $('#export-title').val(),
        subtitle: $('#export-subtitle').val(),
        disclaimer: _this.options.disclaimer
    };
    var zoom = map.getZoom();
    var center = map.getCenter();
    var bearing = map.getBearing();
    var isPNG

    type === 'png' ?  isPNG = true : isPNG = false

    _this.printPDF(size, mapText, zoom, center, bearing, isPNG)
}

PrintControl.prototype.printPNG = function(pdf) {
    var _this = this;

    PDFJS.getDocument(pdf.output('datauri')).then(function(doc) {
        doc.getPage(1).then(function(page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var task = page.render({canvasContext: context, viewport: viewport})
            task.promise.then(function(){
                canvas.toDataURL('image/png');
                canvas.toBlob(function(blob) {
                  saveAs(blob, 'map.png');
                })
            });
        })
    });
}

PrintControl.prototype.printPDF = function(size, mapText, zoom, center, bearing, isPNG) {
    var _this = this;
    var dimensions = (size === 'default') ? [612, 792] : [792, 1224];
    var pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: dimensions
    });

    if (mapText.title === '') {
        mapText.title = _this.options.defaultTitle || 'PortGIS';
    }

    if (size === 'default') {
        if (mapText.disclaimer !== '') {
            var height = DEFAULT_HEIGHT + 4;
            //map
            pdf.addImage(_this.cropper.cropper('getCroppedCanvas').toDataURL('image/png'),
                'png', BORDER_MARGINS, BORDER_MARGINS, DEFAULT_WIDTH - BORDER_MARGINS * 2, height - BORDER_MARGINS * 2);

            //line divider
            pdf.setLineWidth(1);
            var pad1 = BORDER_MARGINS - 3;
            pdf.setDrawColor(214,214,214);
            pdf.line(BORDER_MARGINS, DEFAULT_HEIGHT + pad1, DEFAULT_WIDTH - BORDER_MARGINS, DEFAULT_HEIGHT + pad1);

            //title
            var pad2 = 20;
            pdf.setFontSize(12);
            pdf.setTextColor(65,64,66);
            pdf.text(mapText.title, MARGINS, height + pad1 + pad2);

            //disclaimer
            var pad3 = 14;
            pdf.setFontSize(5);
            pdf.setTextColor(109,110,113);
            var lines = pdf.splitTextToSize(mapText.disclaimer, DEFAULT_WIDTH - (MARGINS * 2));
            pdf.text(MARGINS, height + pad1 + pad2 + pad3, lines);

            //north arrow
            _this.addNorthArrow(DEFAULT_HEIGHT, pad1 + pad2, DEFAULT_WIDTH, size, pdf);

            //scalebar
            _this.addScaleBar(pdf, size, (height - BORDER_MARGINS * 4), (DEFAULT_WIDTH - BORDER_MARGINS * 2));
        }
    } else {
        if (mapText.disclaimer !== '') {
            var height = LARGE_HEIGHT + 4;
            //map
            pdf.addImage(_this.cropper.cropper('getCroppedCanvas').toDataURL('image/png'),
                'png', BORDER_MARGINS * PT_RATIO, BORDER_MARGINS * PT_RATIO, LARGE_WIDTH - BORDER_MARGINS * 2 * PT_RATIO, height - BORDER_MARGINS * 2 * PT_RATIO);

            //line divider
            pdf.setLineWidth(1.2 * PT_RATIO);
            var pad1 = (BORDER_MARGINS * PT_RATIO) - (5.5 * PT_RATIO);
            pdf.setDrawColor(214,214,214);
            pdf.line(BORDER_MARGINS * PT_RATIO, LARGE_HEIGHT + pad1, LARGE_WIDTH - BORDER_MARGINS * PT_RATIO, LARGE_HEIGHT + pad1);

            //title
            var pad2 = 18 * PT_RATIO;
            pdf.setFontSize(12 * PT_RATIO);
            pdf.setTextColor(65,64,66);
            pdf.text(mapText.title, MARGINS * PT_RATIO, height + pad1 + pad2);

            //disclaimer
            var pad3 = 14 * PT_RATIO;
            pdf.setFontSize(5 * PT_RATIO);
            pdf.setTextColor(109,110,113);
            var lines = pdf.splitTextToSize(mapText.disclaimer, LARGE_WIDTH - (MARGINS * 2 * PT_RATIO));
            pdf.text(MARGINS * PT_RATIO, height + pad1 + pad2 + pad3, lines);

            //legend
            var pad4 = BORDER_MARGINS * 2 * PT_RATIO;
            var startLegend = LARGE_WIDTH + BORDER_MARGINS / 2 * PT_RATIO;
            pdf.setTextColor(25,25,26);
            pdf.setFontSize(10 * PT_RATIO);
            pdf.text('Legend', startLegend, pad4);

            this.buildLegend(startLegend, pad4, pdf);

            //north arrow
            _this.addNorthArrow(LARGE_HEIGHT, pad1 + pad2, LARGE_WIDTH - BORDER_MARGINS * PT_RATIO, size, pdf);

            //scalebar
            _this.addScaleBar(pdf, size, (height - BORDER_MARGINS * 4 * PT_RATIO), (LARGE_WIDTH - BORDER_MARGINS * 2 * PT_RATIO));
        }
    }

    if (!isPNG) {
        setTimeout(function() {
          pdf.save('map.pdf');
        }, 2250);
    } else {
        setTimeout(function() {
            _this.printPNG(pdf);
        }, 2250)
    }
}

PrintControl.prototype.addNorthArrow = function (height, pad, width, size, pdf) {
    var _this = this;
    var canvas = document.createElement("canvas");
    canvas.id = 'north-arrow-canvas';

    if (size === 'default') {
      canvas.width = 20;
      canvas.height = 20;
    } else {
      canvas.width = 20;
      canvas.height = 20;
    }

    canvas.attributes.h = height + pad;
    canvas.attributes.w = width;
    canvas.attributes.s = size;

    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.src = _this.options.northArrow;
    img.onload = function() {
        // roate north arrow
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(_this._map.getBearing() * -1 * Math.PI / 180);
        ctx.drawImage(img, canvas.width / -2, canvas.height / -2, canvas.width, canvas.height);

        var dataURL = canvas.toDataURL('image/png');

        if (canvas.attributes.s === 'default') {
          var w = canvas.attributes.w - (canvas.width + 40 - BORDER_MARGINS);
          var h = canvas.attributes.h - MARGINS;
        } else {
          var w = canvas.attributes.w - (canvas.width + 40 - BORDER_MARGINS * PT_RATIO);
          var h = canvas.attributes.h - MARGINS * PT_RATIO;
        }
        pdf.addImage(dataURL, 'png', w , h);
    }
    img.crossOrigin = '';
}

PrintControl.prototype.buildLegend = function(width, height, pdf) {
    var _this = this;
    var map = _this._map;

    // map layers
    var layers = map.getStyle().layers.filter(function(lyr) {
        if (lyr.hasOwnProperty('layout') && lyr.layout.hasOwnProperty('visibility')) {
            return (lyr.source && lyr.source !== 'composite' && lyr.source.indexOf('mapbox-gl-draw') == -1 && lyr.layout.visibility === 'visible')
        } else {
            return (lyr.source && lyr.source !== 'composite' && lyr.source.indexOf('mapbox-gl-draw') == -1)
        }
    });

    var tempLayers = [];
    // need to only acknowledge visible layers that are within the LT
    for (var tl = 0; tl < layers.length; tl++) {
        var elm = '#' + layers[tl].id;
        if ($('#mapboxgl-legend ' + elm).length) {
            tempLayers.push(layers[tl]);
        }
    }

    layers = tempLayers;

    // layer config
    var lyrConfig = map.lyrs;
    var labelSize = 7 * PT_RATIO;
    var startingWidth = width;
    var startingHeight = height + 9 * PT_RATIO;

    var groupLayers = lyrConfig.filter(function(lyr) {
        return (lyr.hasOwnProperty('layerGroup'))
    })

    var groupLayerTracker = [];

    pdf.setTextColor(25,25,26);
    pdf.setFontSize(8 * PT_RATIO);

    for (var i = layers.length - 1; i >= 0; i--) {
        var startingHeight = startingHeight + labelSize;
        var layer = layers[i];
        var nonGroupedLayer = lyrConfig.filter(function(lyr) {
            return (lyr.id === layer.id)
        })

        if (nonGroupedLayer.length) {
            var mapLayer = nonGroupedLayer[0];
            var id = mapLayer.id;

            var elm = $('#' + id + '> i');
            var imgElm = $('#' + id + '> img');

            // font-awesome icon?
            if (elm.length) {
                _this.addFontAwesome(elm[0], id, pdf, startingWidth, startingHeight + 1);
            // custom images?
            } else if (imgElm.length) {
                _this.addImage(imgElm[0], id, pdf, startingWidth, startingHeight + 1);
            }

            pdf.text(mapLayer.name, startingWidth + 18, startingHeight);
        } else {
            for (var gr = 0; gr < groupLayers.length; gr++) {
                var found = groupLayers[gr].layerGroup.filter(function(lay) {
                    return lay.id === layer.id
                })

                if (found.length > 0) {
                    // have we added this group of layers yet?
                    if (groupLayerTracker.indexOf(layer.id) === -1) {

                        var id = groupLayers[gr].id;
                        var elm = $('#' + id + '> i');
                        var imgElm = $('#' + id + '> img');

                        // font-awesome icon?
                        if (elm.length) {
                            _this.addFontAwesome(elm[0], id, pdf, startingWidth, startingHeight + 1);
                        // custom images?
                        } else if (imgElm.length) {
                            _this.addImage(imgElm[0], id, pdf, startingWidth, startingHeight + 1);
                        }

                        pdf.text(groupLayers[gr].name, startingWidth + 18, startingHeight);

                        var layerGroup = groupLayers[gr].layerGroup;
                        var childLayers = [];

                        //get childLayers within a specific layerGroup
                        for (var ml = layers.length - 1; ml >= 0; ml--) {
                            for (var lg = 0; lg < layerGroup.length; lg++) {
                              if (layers[ml].id === layerGroup[lg].id) {
                                childLayers.push(layerGroup[lg]);
                              }
                            };
                        };

                        for (var c = 0; c < childLayers.length; c++) {
                            var id = childLayers[c].id;

                            var childHeight = startingHeight + (c * labelSize) + ((c + 1) * 6 * PT_RATIO);
                            groupLayerTracker.push(childLayers[c].id);

                            var elm = $('#' + id + '> i');
                            var imgElm = $('#' + id + '> img');

                            // font awesome icon?
                            if (elm.length) {
                                _this.addFontAwesome(elm[0], id, pdf, startingWidth + 18 * PT_RATIO, childHeight + labelSize + 1);
                            // custom image icon?
                            } else if (imgElm.length) {
                                _this.addImage(imgElm[0], id, pdf, startingWidth + 18 * PT_RATIO, childHeight + labelSize + 1);
                            }

                            pdf.text(childLayers[c].name, startingWidth + 32 * PT_RATIO, childHeight + labelSize);
                        };

                        startingHeight = childHeight - labelSize;
                    }
                }
            }

        }
        startingHeight = startingHeight + labelSize;
    }
}

PrintControl.prototype.addScaleBar = function(pdf, size, h, w) {
    var _this = this;
    var scaleElm = $('.mapboxgl-ctrl.mapboxgl-ctrl-scale')[0];

    html2canvas(scaleElm).then(function(canvas) {
        var dataURL = canvas.toDataURL('image/png');
        if (size === 'default') {
            pdf.addImage(dataURL, 'png', (w + BORDER_MARGINS * 2 - canvas.width),  (h + BORDER_MARGINS / 2));
        } else {
            pdf.addImage(dataURL, 'png', w + (BORDER_MARGINS * 3 * PT_RATIO) - (canvas.width * PT_RATIO),  h + (BORDER_MARGINS * PT_RATIO));
        }
    })
}

PrintControl.prototype.addImage = function(imgElm, id, pdf, startingWidth, startingHeight) {
    var canvas = document.createElement("canvas");
    canvas.id = id + '-canvas';
    canvas.width = 18;
    canvas.height = 18;

    var ctx = canvas.getContext("2d");

    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 18, 18);
        var dataURL = canvas.toDataURL('image/png');
        pdf.addImage(dataURL, 'png', startingWidth + 1, startingHeight - (canvas.height / 2) - 2);
    }
    img.crossOrigin = '';
    img.src = imgElm.src;
}

PrintControl.prototype.addFontAwesome = function(elm, id, pdf, startingWidth, startingHeight) {
    var character = window.getComputedStyle(
        elm, ':before'
    ).getPropertyValue('content').replace(/['"]+/g, '');

    var canvas = document.createElement("canvas");
    canvas.id = id + '-canvas';
    canvas.width = 36;
    canvas.height = 36;

    var ctx = canvas.getContext("2d");
    ctx.font = "18px FontAwesome";
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    ctx.fillStyle = elm.style.color;
    ctx.fillText(character, 9, 9);
    ctx.strokeStyle = elm.style.webkitTextStrokeColor === '' || elm.style.webkitTextStrokeColor === 'initial' ? 'transparent' : elm.style.webkitTextStrokeColor;
    ctx.lineWidth = 2;
    ctx.strokeText(character, 9, 9);

    var dataURL = canvas.toDataURL('image/png')
    pdf.addImage(dataURL, 'png', startingWidth - 4, startingHeight - (canvas.height / 2));
}
