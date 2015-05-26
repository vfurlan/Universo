exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "anno": "INTEGER",
		    "relatore": "TEXT",
		    "cv": "TEXT",
		    "abstract": "TEXT",
		    "serata": "TEXT",
		    "titolo_abstract": "TEXT",
		    "orario": "TEXT",
		    "video": "TEXT",
		    "pdf": "TEXT",
		    "youtube": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "utente",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};