var lastResult;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$(function() {

    var dataFile = $('body').attr('data-file');
    if (dataFile) {

        $.ajax({
            mimeType: 'text/plain; charset=x-user-defined',
            url:       dataFile,
            type:      "GET",
            dataType:  "text",
            cache:     false,
            success:   function(data) {
                parseData(data, processData);
            }
        });

    }

});

function parseData(data, callback) {

    var results = Papa.parse(data, {
        header: true,
        delimiter: ';',
        newline: '\r\n',
        fastMode: false,
        skipEmptyLines: true,
    });
    lastResult = results;

    callback(results.data);
}

function processData(data) {

    // go through all data generation snippets
    var wrappers = $('.data-repeat-wrapper');
    $.each(wrappers, function (index, wrapper) {

        // find template
        var template = $(wrapper).find('.data-repeat-template');
        
        // go through data
        $.each(data, function (index, row) {

            // duplicate template
            var copy = $(template).clone();
            copy.removeClass('data-repeat-template');

            // Remove conditional elements
            var ifs = $(copy).find('[data-if]');
            $.each(ifs, function (index, condElem) {
                var condition = $(condElem).attr('data-if');
                if (row[condition] == false) {
                    $(condElem).remove();
                }
            });

            // Remove negative conditional elements
            var notifs = $(copy).find('[data-not-if]');
            $.each(notifs, function (index, condElem) {
                var condition = $(condElem).attr('data-not-if');
                if (row[condition]) {
                    $(condElem).remove();
                }
            });

            // fill template
            var html = copy.html();
            $.each(row, function (key, value) {
                var placeholder = "%" + key;
                html = html.replaceAll(placeholder, value);
            });
            copy.html(html);

            // show and append
            $(wrapper).append(copy);
            copy.show();
        });

    });

}