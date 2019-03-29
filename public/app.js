$.getJSON("/articles", function (data) {

  for (var i = 0; i < data.length; i++) {

    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].src + "<br />" +
    "<button data-id='" + data._id + "' id='savenote'>Save Note</button>" +  "</p>");

  }
});

$(document).on("click", "p", function () {

  $("#articles").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {

      console.log(data);

      $("#articles").append("<h2>" + data.title + "</h2>");

      $("#articles").append("<input id='titleinput' name='title' >");

      $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#articles").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      

      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#articles").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
