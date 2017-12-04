$(document).ready(function () {

    // Populate the json layer dropdown
    var catagory = "";
    var optgroup_count = 0;

    $.getJSON("assets/plugins/jsonSearch/json/layers.json", function (obj) {
        var $optgroup;
        $("#json_layer").append($('<option></option>'));
        $.each(obj.Layers, function (key, value) {
            if (value.catagory !== catagory) {
                if (optgroup_count > 0) {
                    $("#json_layer").append($optgroup);
                }
                $optgroup = $("<optgroup>", { label: value.catagory });
                $optgroup.append($('<option></option>').val(value.source + "-" + value.type).html(value.display_name));
                catagory = value.catagory;
                ++optgroup_count;
            } else {
                $optgroup.append($('<option></option>').val(value.source + "-" + value.type).html(value.display_name));
            }
        });

        $("#json_layer").append($optgroup);

        $("#json_layer").chosen({ width: "200px;" });

    });
});