var CsvToHtmlTable = CsvToHtmlTable || {};

CsvToHtmlTable = {
    init: function (options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "table-container";
        var allow_download = options.allow_download || false;
        var csv_options = options.csv_options || {};
        var datatables_options = options.datatables_options || {};
        var custom_formatting = options.custom_formatting || [];

        $("#" + el).html("<table class='table table-condensed' id='" + el + "-table'></table>");

        $.when($.get(csv_path)).then(
            function (data) {
                var csv_data = $.csv.toArrays(data, csv_options);

                var table_head = "<thead><tr>";

                table_head += "<th>" + csv_data[0][0] + "</th>";
                // for (head_id = 0; head_id < csv_data[0].length; head_id++) {
                //     table_head += "<th>" + csv_data[0][head_id] + "</th>";
                // }

                table_head += "</tr></thead>";
                $('#' + el + '-table').append(table_head);
                $('#' + el + '-table').append("<tbody></tbody>");

                for (row_id = 1; row_id < csv_data.length; row_id++) {
                    var row_html = "<tr><td>";
                    // var row_html = "";

                    //takes in an array of column index and function pairs
                    if (custom_formatting != []) {
                        $.each(custom_formatting, function (i, v) {
                            var col_idx = v[0];
                            var func = v[1];
                            csv_data[row_id][col_idx] = func(csv_data[row_id][col_idx]);
                        })
                    }

                    for (col_id = 0; col_id < csv_data[row_id].length; col_id++) {
                        if (csv_data[row_id][col_id] && csv_data[row_id][col_id] != "") {
                            if (col_id == 0) {
                                row_html += "<div style='padding-bottom:5px;'><strong>" + csv_data[row_id][col_id] + "</strong></div>";
                            } else {
                                row_html += "<div style='padding-bottom:5px'>" + csv_data[row_id][col_id] + "</div>";
                            }
                        }
                    }

                    row_html += "</td></tr>";
                    $('#' + el + '-table tbody').append(row_html);
                }

                $('#' + el + '-table').DataTable(datatables_options);

                if (allow_download) {
                    $("#" + el).append("<p><a class='btn btn-info' href='" + csv_path + "'><i class='glyphicon glyphicon-download'></i> Download as CSV</a></p>");
                }
            });
    },
    showReleaseList: function(options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "release-container";
        var csv_options = options.csv_options || {};
        $.when($.get(csv_path)).then(
            function (data) {
                var csv_data = $.csv.toArrays(data, csv_options);
                console.log(csv_data)
                var html = '';
                for (row_id = 0; row_id < csv_data.length; row_id++) {
                    html += `<div><a href="#" data-link="` + csv_data[row_id][1] + `" target="_blank">` + csv_data[row_id][0] + `</a></div>`
                }

                $("#" + el).html(html);
            }
        )
    }
};