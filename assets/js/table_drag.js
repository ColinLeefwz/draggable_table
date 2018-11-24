table_drag = {
  INPUT_TABLES: [
    {
      name: "inputTable",
      data: [
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        }
      ]
    }
  ],
  OUTPUT_TABLES: [
    {
      name: "outputTable",
      data: [
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        },
        {
          CONVERT_ID: "1010001",
          SEQUENCE: 1805680,
          ID: "21010001",
          NAME: "colin1",
          TYPE: "string",
          DESCRIPTION: "Embedding."
        }
      ]
    }
  ],
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
    this.initJsPlumb();
    this.initTableNames();
  },

  bindingEvents : function() {
    $('.js-add-table').on('click', this.addTablePosition);
    $('#deleteModal').on('show.bs.modal', this.deleteTableModal);
    $('#editModal').on('show.bs.modal', this.editTableModal);
    $('#saveModal').on('show.bs.modal', this.saveTableModal);
    $('.search-modal').on('click', '.js-submit-form', this.loadTables);
  },

  initTableNames : function() {
    // $.ajax({
    //   type: "GET",
    //   url: "/scan_tables",
    //   success: function(data) {
    //     console.log(data);
    //   }
    // });

    var res = {
      input_tables: [
        {
          table_name: "inputTable"
        }
      ],
      output_tables: [
        {
          table_name: "outputTable"
        }
      ]
    };

    table_drag.loadTablesTemplate(res.input_tables, "left");
    table_drag.loadTablesTemplate(res.output_tables, "right");
  },

  loadTablesTemplate : function(tables, pos) {
    if (tables && tables.length > 0) {
      var groupHtml = "";
      tables.forEach(function(table) {
        var name = table.table_name;
        groupHtml += "<label for='" + name + "' class='col-form-label'>" + name + "</label>";
        groupHtml += "<input type='checkbox' class='form-control js-table-name' id='" + name + "'>";
      });

      $("#search-" + pos + "-modal .js-tables-group").html(groupHtml);
    }
  },

  loadTables : function() {
    var names =[];
    var position = $(this).data("position");
    var anchor = (position === "left") ? "Right" : "Left";
    $("#search-" + position + "-modal").find(".js-tables-group .js-table-name").each(function(i, e) {
      if( $(e).is( ":checked" )) {
        names.push($(e).attr("id"));
      }
    });
    var tables = table_drag.readTables(names, position);

    var $field = $(".drawCanvas ." + position + "-field");
    var no = $field.find(".divTable").length

    table_drag.buildTableTemplate(tables, position, no);
  },

  readTables : function(names, position) {
    var tables = [];
    var source_tables = (position == "left") ? table_drag.INPUT_TABLES : table_drag.OUTPUT_TABLES
    names.forEach(function(e) {
      source_tables.forEach(function(ele) {
        if (ele.name == e) {
          tables.push(ele);
        }
      });
    });

    return tables
  },

  buildTableTemplate : function(tables, position, no) {
    var key = position + "-table" + no;
    var anchor = (position === "left") ? "Right" : "Left";
    var $field = $(".drawCanvas ." + position + "-field");
    table_drag.connStatus[key] = {};

    var newTables = [];
    tables.forEach(function(t) {
      var $card = $($("#js-card-template").html());
      var $table = $card.find(".divTable");
      var $header = $table.find(".divTableHeader");
      var rows = t.data;
      var firstRow = rows[0];
      var ths = "";
      var columns = [];
      for(var column in firstRow) {
        columns.push(column);
        ths += "<div class = 'divTableTh'>" + column + "</div>";
      }
      $header.append($(ths));

      // add td
      for ( var row_i = 0; row_i < rows.length; row_i++) {
        var keyIndex = key + "_" + row_i;
        var $row = $("<div class = 'divTableRow' id='" + keyIndex + "'></div>");

        for ( var col in rows[row_i]) {
          $row.append('<div id = "' + keyIndex + "_" + columns.indexOf(col) +
            '" class = "divTableTd" contenteditable="true">' + rows[row_i][col] + '</div>');
        }

        $table.append($row);
        table_drag.connStatus[key][keyIndex] = {"text": rows[row_i], "connection": []};
      }

      $table.addClass("table-" + position);
      console.log(table_drag.connStatus);

      $card.find(".js-card-title").text(t.name);
      $card.find(".js-save-btn").text("保存");
      $card.find(".js-remove-btn").text("削除");

      $field.append($card);
      $card.find(".divTableRow").each(function(i, e) {
        var id = $(e).attr('id');
        jsPlumb.addEndpoint(id, {
          anchor: [anchor]
        }, table_drag.common);
      });
    });

    $("#search-" + position + "-modal").modal("hide");
  },

  deleteTableModal : function(e) {
    var $button = $(e.relatedTarget);
    var $modal = $(this).parents(".modal");
    var $card = $($button.parents(".js-card")[0]);
    var $conns = $card.find(".divTableRow.jtk-connected");
    var $anchors = $card.find(".divTableRow.jtk-endpoint-anchor");

    $(".js-modal-delete").off("click");
    $(".js-modal-delete").click(function() {
      $conns.each(function(i, e) {
        var itemId = $(e).attr("id");
        jsPlumb.getConnections({source: itemId}).forEach(function(conn) {
          table_drag.deleteLine(conn);
        });
        jsPlumb.getConnections({target: itemId}).forEach(function(conn) {
          table_drag.deleteLine(conn);
        });

      });

      $anchors.each(function(i, e) {
        var itemId = $(e).attr("id");
        jsPlumb.remove(itemId);
      });

      $button.parents(".js-card")[0].remove();
      $('#deleteModal').modal("hide");
    });
  },

  saveTableModal : function(e) {
    var $button = $(e.relatedTarget);
    var $modal = $(this).parents(".modal");
    var $card = $($button.parents(".js-card")[0]);

    $(".js-modal-save").off("click");
    $(".js-modal-save").click(function() {
      var name = $card.find(".js-card-title").text();
      var columns = $card.find(".divTableHeader .divTableTh").map(function(index, ele) {
        return $(ele).text();
      });

      var table = {};
      var data = $card.find(".divTableRow").map(function(index, ele) {
        var cols = $(ele).find(".divTableTd").map(function(colIndex, colEle) {
          return $(colEle).text();
        });
        var rowData = {};
        for (var col = 0; col < columns.length; col++) {
          rowData[columns[col]] = cols[col];
        }

        return rowData;
      });
      table["name"] = name;
      table["data"] = data;
      console.log(table);

      // TODO send table to backend
      $('#saveModal').modal("hide");
    });
  },

  editTableModal : function(e) {
    var $button = $(e.relatedTarget);
    var $modal = $(this).parents(".modal");
    var $card = $($button.parents(".js-card")[0]);
    var $conns = $card.find(".divTableRow.jtk-connected");
    var $anchors = $card.find(".divTableRow.jtk-endpoint-anchor");

    $(".js-modal-confirm").off("click");
    $(".js-modal-confirm").click(function() {
      $conns.each(function(i, e) {
        var itemId = $(e).attr("id");
        jsPlumb.getConnections({source: itemId}).forEach(function(conn) {
          table_drag.deleteLine(conn);
        });
        jsPlumb.getConnections({target: itemId}).forEach(function(conn) {
          table_drag.deleteLine(conn);
        });

      });

      $anchors.each(function(i, e) {
        var itemId = $(e).attr("id");
        jsPlumb.remove(itemId);
      });

      $button.parents(".js-card")[0].remove();
      $('#deleteModal').modal("hide");
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

      // 線をクリックしたら、確認メッセージを表示して終了
      jsPlumb.bind("click", function(conn, originalEvent) {
        var msg = "この線を削除しますか"
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

  // 線削除
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
