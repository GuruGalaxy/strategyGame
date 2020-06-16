var getPath = function(name) {
    return '/partials/' + name + '.tmpl.html';
};

var renderExtTemplate = function(element, data, templateName) {
    var filePath = getPath( templateName );

    return fetch(filePath)
    .then(function(response){
        return response.text();
    })
    .then(function(tmplData){
        $.templates({ tmpl: tmplData });
        console.log("tmplData", tmplData);
        return $(element).append($.render.tmpl(data));
    });   
};