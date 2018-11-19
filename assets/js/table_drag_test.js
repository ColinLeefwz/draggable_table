table_drag = {
  connStatus : {"connections": {}},
  common : {
    isSource: true,
    isTarget: true,
    connector: ['Bezier'],
    maxConnections: -1,
    paintStyle: {
      fill: 'green'
    },
    connectorStyle: {
      outlineStroke: 'green',
      strokeWidth: 2
    },
    connectorHoverStyle: {
      strokeWidth: 4
    }
  },
  init : function() {
    this.initStatus();
    this.bindingEvents();
  },

  initStatus : function() {
    // this.initTable();
    this.initJsPlumb();
  },

  bindingEvents : function() {
    $('.js-add-table').on('click', this.addTablePosition);
    $("#searchDB").on('click', this.searchSubmit);
  },

  makeTable : function(tableInput, position, no) {
    var key = position + "-table" + no;
    table_drag.connStatus[key] = {};
    var table = $("<div></div>");
    table.addClass("divTable");

    var rowNo = tableInput.detail[0].length;
    var $th = $("<div class='divTableHeader'></div");
    $th.append('<div class = "divTableTh">' +
      tableInput.name + '</div>');
    // add row
    for (i = 1; i < rowNo; i++) {
      $th.append('<div class = "divTableTh"></div>');
    }
    table.append($th);

    // add td
    for (var index in tableInput.detail) {
      var row = tableInput.detail[index];
      var keyIndex = key + "_" + index;
      var $row = $("<div class = 'divTableRow' id='" + keyIndex + "'></div>");

      for (var tdIdx in row) {
        $row.append('<div id = "' + keyIndex + "_" + tdIdx +
          '" class = "divTableTd"> ' + row[tdIdx] + '</div>');
      }

      table.append($row);
      table_drag.connStatus[key][keyIndex] = {"text": row, "connection": []};
    }
    table.addClass("table-" + position);
    console.log(table_drag.connStatus);
    return table;
  },

  searchSubmit : function() {
    var position = $(this).data("position");
    var anchor = (position === "left") ? "Right" : "Left";

    var tableInfo = table_drag.searchDB();
    var $field = $(".drawCanvas ." + position + "-field");

    var no = $field.find(".divTable").length
    var newTable = table_drag.makeTable(tableInfo, position, no);
    $field.append(newTable);
    $("#searchModal").modal("hide");

    newTable.find(".divTableRow").each(function(i, e) {
      var id = $(e).attr('id');
      jsPlumb.addEndpoint(id, {
        anchor: anchor
      }, table_drag.common);
    });
  },

  addTablePosition : function() {
    var position = $(this).data('whatever');
    $("#searchDB").data("position", position);
  },

  initJsPlumb : function() {
    jsPlumb.ready(function() {
      jsPlumb.setContainer('diagramContainer')

      jsPlumb.importDefaults({
        ConnectionsDetachable: true
      });

      // $B@~$r%/%j%C%/$7$?$i!"3NG'%a%C%;!<%8$rI=<($7$F=*N;(B
      jsPlumb.bind("click", function(conn, originalEvent) {
        var msg = "$B$3$N@~$r:o=|$7$^$9$+(B"
        $("#confirmMsg").html(msg);
        $("#confirmModal").modal("show");

        $("#confirmOk").off("click");
        $("#confirmOk").click(function() {
          $("#confirmModal").modal("hide");
          table_drag.deleteLine(conn);
        });
      });

      jsPlumb.bind("connection", function(info, originalEvent) {
        var source = info.sourceId;
        var target = info.targetId;
        var connId = info.connection.id;

        table_drag.connStatus.connections[connId] = {"source": source, "target": target};

        var tableKeySource = source.split("_")[0];
        var tableConnSource = table_drag.connStatus[tableKeySource][source].connection;
        if ($.inArray(target, tableConnSource) < 0) {
          tableConnSource.push(target);
        }

        var tableKeyTarget = target.split("_")[0];
        var tableConnTarget = table_drag.connStatus[tableKeyTarget][target].connection;
        if ($.inArray(source, tableConnTarget) < 0) {
          tableConnTarget.push(source);
        }
        console.log(table_drag.connStatus);
      });

      $(".tableLeft .divTableRow").each(function() {
        var id = $(this).attr('id');
        jsPlumb.addEndpoint(id, {
          anchor: 'Right'
        }, table_drag.common);
      });

      $(".tableRight .divTableRow").each(function() {
        var id = $(this).attr('id');
        jsPlumb.addEndpoint(id, {
          anchor: 'Left'
        }, table_drag.common);
      });
    });

  },

  searchDB : function() {
    return newTableInfo = {
        "name": "$BF~NO(B2",
        "detail": [
                  ["$B9`L\(B1-1","$B9`L\(B1-2"],
                  ["$B9`L\(B2-1","$B9`L\(B2-2"],
          ["$B9`L\(B3-1","$B9`L\(B3-2"]
        ]
    }
  },

  // $B@~:o=|(B
  deleteLine : function(connection) {
    var connId = connection.id;
    var connInfo = this.connStatus.connections[connId];
    var sourceId = connInfo.source;
    var targetId = connInfo.target;
    this.removeConn(sourceId, targetId);
    this.removeConn(targetId, sourceId);
    delete this.connStatus.connections[connId];

    console.log(this.connStatus);

    jsPlumb.deleteConnection(connection);
  },

  removeConn : function(fromId, toId) {
    var tableKey = fromId.split("_")[0];
    var connection = table_drag.connStatus[tableKey][fromId].connection;
    var eleIndex = connection.indexOf(toId);
    if (eleIndex >= 0) {
      connection.splice(eleIndex);
    }
  }
}
