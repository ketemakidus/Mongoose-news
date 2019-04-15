$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].link +
        "<br />" +
        "<button data-id='" +
        data._id +
        "' id='savenote'>Save Note</button>" +
        "</p>"
    );
  }
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {}
  }).then(function(data) {
    $("#notes").prepend(
      "<p class='data-entry' data-id=" +
        data._id +
        "><span class='dataTitle' data-id=" +
        data._title +
        ">" +
        data.title
    );
  });
});

$(document).on("click", "p", function() {
  $("#articles").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);

    $("#notes").append("<h2>" + data.title + "</h2>");

    $("#notes").append("<input id='titleinput' name='title' >");

    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

    $("#notes").append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);

      $("#bodyinput").val(data.note.body);
    }
  });
});
