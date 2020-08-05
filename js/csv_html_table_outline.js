var CsvToHtmlTable = CsvToHtmlTable || {};

function convertStringToDate(str) {
    return str.slice(0,4) + '.' + str.slice(4,6) + '.' + str.slice(6,8);
}

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
                console.log("@@@@@@@@@@@@@@@@")
                var csv_data = $.csv.toArrays(data, csv_options);

                var table_head = "<thead><tr>";
                table_head += "<th>" + "Release Notes" + "</th>";
               // table_head += "<th>" + csv_path.replace('data/', '').replace('.csv', '') + "</th>";
                //table_head += "<th>" + csv_data[0][0] + "</th>";
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
        console.log("dfsfsdf")
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "release-container";
        var csv_options = options.csv_options || {};
        var releaseEl = options.release_element || "release-date";
        $.when($.get(csv_path)).then(
            function (data) {
                console.log(data)
                var csv_data = $.csv.toArrays(data, csv_options);
                csv_data = csv_data.sort(function (a, b) {
                    return b[0] - a[0]
                })
                var html = '<ul>';

                for (row_id = 0; row_id < csv_data.length; row_id++) {
                    var release_date = convertStringToDate(csv_data[row_id][0]);

                    html += '<li><a href="#" data-link="' + csv_data[row_id][1]
                         + '" target="_blank">' + release_date + '</a></li>';
                }
                html += '</ul>'

                $("#" + el).html(html);
               
                $("#" + releaseEl).html("Release " + convertStringToDate(csv_data[0][0]));

                if (csv_data.length > 0 && csv_data[0]) {
                    // refresh table
                    CsvToHtmlTable.init({
                        csv_path: "data/" + csv_data[0][1],
                        element: "table-container",
                        allow_download: false,
                        csv_options: {
                            separator: ",",
                            delimiter: '"'
                        },
                        datatables_options: {
                            paging: false
                        },
                        custom_formatting: [
                            [2, format_link]
                        ]
                    });
                }
            }
        )
    }
};