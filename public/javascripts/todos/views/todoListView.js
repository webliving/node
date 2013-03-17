var app = app || {};

$(function() {
	'use strict';

	// 任务列表视图
	// --------------

	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({

		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template:$('#item-template').html(),

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'togglecompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'close'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function() {
			this.model.on( 'change', this.render, this );
			this.model.on( 'destroy', this.remove, this );
			this.model.on( 'visible', this.toggleVisible, this );
            // 0.9.10
			this.model.on( 'invalid', function(){console.log('invalid');}, this );
            // 0.9.2
			this.model.on( 'error', function(model,error){console.log(error);return false}, this );
		},

		// Re-render the titles of the todo item.
		render: function() {

//            console.log('render',this.model);
			this.$el.html(Mustache.to_html(this.template,this.model.toJSON()));
//			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.toggleClass( 'completed', this.model.get('completed') );

			this.toggleVisible();
			this.input = this.$('.edit');
			return this;
		},

		toggleVisible : function () {
			this.$el.toggleClass( 'hidden',  this.isHidden());
		},

		isHidden : function () {
			var isCompleted = this.model.get('completed');
			return ( // hidden cases only
				(!isCompleted && app.TodoFilter === 'completed')
				|| (isCompleted && app.TodoFilter === 'active')
			);
		},

		// 切换完成状态
		togglecompleted: function(e) {

			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todos.
		close: function() {

			var value = this.input.val().trim(),
                bIsChange=this.model.hasChanged();

			if ( value!=this.model.get('title')) {
                // 保存修改
				this.model.save(
                    { title: value }
                    ,{
                        //wait: true // 控制只有在服务器返回成功之后（响应状态码为200），才将模型对象添加到集合中
                    }
                );
			} else if(!value) {
                // 删除列表
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function( e ) {
			if ( e.which === ENTER_KEY ) {
                $(e.target).blur();
//				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function() {
			this.model.destroy();
		}
	});
});
