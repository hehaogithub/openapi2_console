/**
 * 表格综合示例
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
Ext.onReady(function() {
			// 复选框
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([rownum, sm, {
						header : '操作', // 列标题
						dataIndex : 'edit',
						width : 35,
						renderer : iconColumnRender
					}, {
						header : '学号', // 列标题
						dataIndex : 'sid', // 数据索引:和Store模型对应
						sortable : true
						// 是否可排序
				}	, {
						header : '姓名',
						dataIndex : 'sname',
						sortable : true,
						width : 50
						// 列宽
				}	, {
						header : '性别',
						dataIndex : 'ssex',
						sortable : true,
						width : 50
					}, {
						header : '计算机',
						dataIndex : 'scomputer',
						sortable : true,
						width : 50
					}, {
						header : '英语',
						dataIndex : 'senglish',
						sortable : true,
						width : 50
					}]);

			/**
			 * 数据存储
			 */
			
			var store = new Ext.data.Store({
						// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url :'score.do?reqCode=scoreInit'
				}),
						// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
							name : 'sid' // Json中的属性Key值
						}, {
							name : 'sname'
						}, {
							name : 'ssex'
						}, {
							name : 'scomputer'
						}, {
							name : 'senglish'
						} ])
					});

			      store.load();
			// 每页显示条数下拉选择框
			var pagesize_combo = new Ext.form.ComboBox({
						name : 'pagesize',
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.ArrayStore({
									fields : ['value', 'text'],
									data : [[10, '10条/页'], [20, '20条/页'],
											[50, '50条/页'], [100, '100条/页'],
											[250, '250条/页'], [500, '500条/页']]
								}),
						valueField : 'value',
						displayField : 'text',
						value : '20',
						editable : false,
						width : 85
					});
			var number = parseInt(pagesize_combo.getValue());
			// 改变每页显示条数reload数据
			pagesize_combo.on("select", function(comboBox) {
						bbar.pageSize = parseInt(comboBox.getValue());
						number = parseInt(comboBox.getValue());
						store.reload({
									params : {
										start : 0,
										limit : bbar.pageSize
									}
								});
					});

			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
						pageSize : number,
						store : store,
						displayInfo : true,
						displayMsg : '显示{0}条到{1}条,共{2}条',
						plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
						emptyMsg : "没有符合条件的记录",
						items : ['-', '&nbsp;&nbsp;', pagesize_combo]
					});

			// 表格工具栏
			var tbar = new Ext.Toolbar({
						items : [{
									text : '添加',
									iconCls :'page_addIcon',
									handler : function() {
										addScoreWindow
												.setTitle('<span style="font-weight:normal">添加学生成绩</span>');
									
										Ext.getCmp('windowmode').setValue('add');
										addScoreWindow.show();
								   }
						        },'-', {
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										var record = grid.getSelectionModel().getSelected();//获取选中行数据
										if (Ext.isEmpty(record)) {
											Ext.MessageBox.alert('提示', '请先选择要修改的行!');
											return;
										}
										console.log(record.get('sid'));
										addScoreFormPanel.getForm().loadRecord(record);//将选中行数据填充到form
										Ext.getCmp('windowmode').setValue('update');//设置form
										//Ext.getCmp('sid').setValue(record.get('sid'));//对部门编号赋值
										addScoreWindow
												.setTitle('<span style="font-weight:normal">修改学生成绩</span>');
									
									   
										addScoreWindow.show();
									}
								},'-', {
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										deleteScore('1', '');
									}
								},'-', {
									text : '获取选择行',
									handler : function() {
										getCheckboxValues();
									}
								},'->',{
									xtype : 'textfield',
									id : 'name',
									name : 'name',
									emptyText : '请输入学生名称',
									width : 150,
									enableKeyEvents : true,
									// 响应回车键
									listeners : {
										specialkey : function(field, e) {
											if (e.getKey() == Ext.EventObject.ENTER) {
												queryScore();
											}
										}
									}
								}, {
									text : '查询',
									iconCls : 'page_findIcon',
									handler : function() {
										queryScore();
									}
								},'-',{
									text : '刷新',
									iconCls : 'page_refreshIcon',
									handler : function() {
										store.reload();
									}
								}]
					});

			// 表格右键菜单
			var contextmenu = new Ext.menu.Menu({
						id : 'theContextMenu',
						items : [{
							text : '查看详情',
							iconCls : 'previewIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var xmmc = record.get('xmmc');
								Ext.MessageBox.alert('提示', xmmc);
							}
						}, {
							text : '导出列表',
							iconCls : 'page_excelIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var xmmc = record.get('xmmc');
								Ext.MessageBox.alert('提示', xmmc);
							}
						}]
					});

			// 表格实例
			var grid = new Ext.grid.GridPanel({
						// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
						title : '<span class="commoncss">表格综合演示一</span>',
						margins : '3 3 3 3',
						height : 500,
						frame : true,
						autoScroll : true,
						region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
						store : store, // 数据存储
						stripeRows : true, // 斑马线
						cm : cm, // 列模型
						sm : sm, // 复选框
						tbar : tbar, // 表格工具栏
						bbar : bbar,// 分页工具栏
						viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
						// forceFit : true
						},
						loadMask : {
							msg : '正在加载表格数据,请稍等...'
						}
					});
			
			//学生成绩表单面板
			var addScoreFormPanel = new Ext.form.FormPanel( {
				id : 'addScoreFormPanel',
				name : 'addScoreFormPanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 70,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [ {
					fieldLabel : '姓名',
					name : 'sname',
					id : 'sname',
					allowBlank : false,
					labelStyle: micolor,
					anchor : '99%'
				},{
				id : 'windowmode',
				name : 'windowmode',
				hidden : true
			    },{
					id : 'sid',
					name :'sid',
					hidden : false
				},{
					fieldLabel : '性别',
					id:'ssex',
					name : 'ssex',
					allowBlank : true,
					anchor : '99%'
				}, {
					fieldLabel : '计算机',
					id:'scomputer',
					name : 'scomputer',
					allowBlank : true,
					anchor : '99%'
				},{
					fieldLabel : '英语',
					id:'senglish',
					name : 'senglish',
					allowBlank : true,
					anchor : '99%'
				 }]
			});
			
			//新增成绩弹出窗口
			var addScoreWindow = new Ext.Window( {
				layout : 'fit',
				width : 400,
				height : 215,
				resizable : false,
				draggable : true,
				closable : true,
				modal : true,
				closeAction : 'hide',
				title : '<span class="commoncss">新增学生成绩</span>',
				// iconCls : 'page_addIcon',
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				pageY : 20,
				pageX : document.body.clientWidth / 2 - 420 / 2,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ addScoreFormPanel ],
				buttons : [
						{
							text : '保存',
							iconCls : 'acceptIcon',
							id : 'save',
							handler : function() {
								if (runMode == '0') {
									Ext.Msg.alert('提示',
											'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
									return;
								}
								var mode = Ext.getCmp('windowmode').getValue();
								if (mode == 'add')
									saveScore();
								else
									updateScore();
							}
						}, {
							text : '重置',
							id : 'btnReset',
							iconCls : 'tbar_synchronizeIcon',
							handler : function() {
								clearForm(addScoreFormPanel.getForm());
							}
						}, {
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								addScoreWindow.hide();
							}
						} ]
			});
			
			

			// 是否默认选中第一行数据
			bbar.on("change", function() {
						// grid.getSelectionModel().selectFirstRow();

					});

			// 页面初始自动查询数据
			// store.load({params : {start : 0,limit : bbar.pageSize}});

			// 小画笔点击事件
			grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
						var store = pGrid.getStore();
						var record = store.getAt(rowIndex);
						var fieldName = pGrid.getColumnModel()
								.getDataIndex(columnIndex);
						// columnIndex为小画笔所在列的索引,缩阴从0开始
						// 这里要非常注意!!!!!
						if (fieldName == 'edit' && columnIndex == 2) {
							var xmmc = record.get("xmmc");
							// 到此你就可以继续做其他任何事情了
							Ext.MessageBox.alert('提示', xmmc);
						}
					});

			// 监听单元格双击事件
			grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e) {
				var record = pGrid.getStore().getAt(rowIndex);
				var fieldName = pGrid.getColumnModel()
						.getDataIndex(columnIndex);
				var cellData = record.get(fieldName);
					// Ext.MessageBox.alert('提示', cellData);
				});

			// 监听行双击事件
			grid.on('rowdblclick', function(pGrid, rowIndex, event) {
						// 获取行数据集
						var record = pGrid.getStore().getAt(rowIndex);
						// 获取单元格数据集
						var data = record.get("xmmc");
						Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
					});

			// 给表格绑定右键菜单
			grid.on("rowcontextmenu", function(grid, rowIndex, e) {
						e.preventDefault(); // 拦截默认右键事件
						grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
						contextmenu.showAt(e.getXY());
					});

			// 布局模型
			var viewport = new Ext.Viewport({
						layout : 'border',
						items : [grid]
					});

			// 查询表格数据
			function queryCatalogItem() {
				store.load({
							params : {
								start : 0,
								limit : bbar.pageSize,
								xmmc : Ext.getCmp('xmmc').getValue()
							}
						});
			}

			// 获取选择行
			function getCheckboxValues() {
				// 返回一个行集合JS数组
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.MessageBox.alert('提示', '您没有选中任何数据!');
					return;
				}
				// 将JS数组中的行级主键，生成以,分隔的字符串
				var strChecked = jsArray2JsString(rows, 'xmid');
				Ext.MessageBox.alert('提示', strChecked);
				// 获得选中数据后则可以传入后台继续处理
			}

			// 演示render的用法
			function colorRender(value, cellMetaData, record) {
				// alert(record.data.xmid); 可以获取到Record对象哦
				if (value == '盒') {
					return "<span style='color:red; font-weight:bold'>" + value
							+ "</span>";
				}
				if (value == '瓶') {
					return "<span style='color:green; font-weight:bold'>"
							+ value + "</span>";
				}
				return value;
			}

			// 生成一个图标列
			function iconColumnRender(value) {
				return "<a href='javascript:void(0);'><img src='" + webContext
						+ "/resource/image/ext/edit1.png'/></a>";
			}
			//添加一条学生成绩记录
			function saveScore(){
				if (!addScoreFormPanel.form.isValid()) {
				return;
			}
			addScoreFormPanel.form.submit( {
				url : 'score.do?reqCode=saveScore',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					addScoreWindow.hide();
					store.reload();
					
					form.reset();
					Ext.MessageBox.alert('提示', action.result.msg);
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '学生成绩保存失败:<br>' + msg);
				}
			});
			    
			}
			//修改学生成绩
			function updateScore(){
					if (!addScoreFormPanel.form.isValid()) {
				return;
			}
			addScoreFormPanel.form.submit( {
				url : 'score.do?reqCode=updateScore',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					addScoreWindow.hide();
					store.reload();
					
					form.reset();
					Ext.MessageBox.alert('提示', action.result.msg);
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '学生成绩修改失败:<br>' + msg);
				}
			});
			
				
			}
			//查询学生信息
			function queryScore(){
				var newUrl = 'score.do?reqCode=queryScoreByName'; 
		  	       store.proxy.setUrl(newUrl);
		  		   
				store.load( {
					params : {
						start : 0,
						limit : bbar.pageSize,
						name : Ext.getCmp('name').getValue()
					}
				});
				 store.proxy.setUrl('score.do?reqCode=scoreInit');
				
			}
			
			
			

		});