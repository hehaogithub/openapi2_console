Ext.onReady(function(){
	   // 申请查询变量
	var qapisystemid = new Ext.form.ComboBox({
		id            : 'id_qapisystemid',
		hiddenName : 'apisystemid', // 往后台传值字段名
		store : OPENAPIStore, // 引用的代码表数据源和<G4Studio:ext.codeStore
								// />标签对应
		mode : 'local',
		triggerAction : 'all',
		valueField : 'value',
		displayField : 'text',
		value : '', // 初始选中的列表项
		fieldLabel : '所属系统',
		emptyText : '请选择...',
		//allowBlank : false,
		forceSelection : true, // 选中内容必须为下拉列表的子项
		editable : true, // 选择输入框可编辑
		typeAhead : true, // 输入的时候自动匹配待选项目
		anchor : '100%'
	});
	var qapicategoryname = new Ext.form.TextField({
			id            : 'id_qapicategoryname',
			name          : 'apicategoryname',
			fieldLabel    : '类别名称',
			selectOnFocus : true,
			maxLength	  : 50,
			anchor        : '100%'
		 }); 
			

				
	var qFormPanel = new Ext.form.FormPanel({
			id : 'id_qapiCategoryFormPanel',
	        name : 'qapiCategoryFormPanel',
			region : 'north',
			title : '<span class="commoncss">查询条件<span>',
			collapsible : true,
			border : true,
			labelWidth : 50, // 标签宽度
			// frame : true, //是否渲染表单面板背景色
			labelAlign : 'right', // 标签对齐方式
			bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
			buttonAlign : 'center',
			height : 120,
			items : [
			{
				layout : 'column',
				border : false,
				items : [
						{
							columnWidth   : .33,
							layout        : 'form',
							labelWidth    : 60, // 标签宽度
							defaultType   : 'textfield',
							border        : false,
							items         : [qapisystemid]
						}
						,
						{
							columnWidth   : .33,
							layout        : 'form',
							labelWidth    : 60, // 标签宽度
							defaultType   : 'textfield',
							border        : false,
							items         : [qapicategoryname]
						}
						
				
					]
			}],
			buttons : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							Ext.getCmp('tbi_edit').disable();
							Ext.getCmp('tbi_del').disable();
							btncx_clicked();
						}
					}, {
						text : '重置',
						iconCls : 'tbar_synchronizeIcon',
						handler : function() {
							qFormPanel.getForm().reset();
						}
					}]
		});
			
	// 申请列表区域
	var qGridStore = new Ext.data.JsonStore({
		url               : './ApiCategory/list.do',
		root              : 'ROOT',
		totalProperty     : 'TOTALCOUNT',
		id                : 'apicategoryid',
		fields            : ['apicategoryid','apisystemid','apicategoryname','sortno']
	});
	
	
	// 翻页排序时带上查询条件
   qGridStore.on('beforeload', function() {
	      this.baseParams = qFormPanel.getForm().getValues();
   });

	var qGridCheckbox = new Ext.grid.CheckboxSelectionModel();
	var qGridColumns = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		//qGridCheckbox,
		{
			header            : '所属系统',
			dataIndex         : 'apisystemid',
			width             : 240,
			renderer 		  : OPENAPIRender,
			align             : 'center'
		}
		 ,
		{
			header            : '类别名称',
			dataIndex         : 'apicategoryname',
			width             : 70,
			align             : 'center'
		},
		{
			header            : '序列号',
			dataIndex         : 'sortno',
			width             : 70,
			align             : 'center'
		}
		 
				
	]);
	qGridColumns.defaultSortable = true;
				
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
				qGridStore.reload({
							params : {
								start : 0,
								limit : bbar.pageSize
							}
						});
			});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : qGridStore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

			
			
			// 表格工具栏
	var tbar = new Ext.Toolbar({
				items : [{
							text : '新增',
							iconCls : 'addIcon',
							id : 'id_tbi_add',
							handler : function() {
								btnxz_clicked();
							}
						}, {
							text : '修改',
							id : 'tbi_edit',
							iconCls : 'edit1Icon',
							disabled : true,
							handler : function() {
								btnxg_clicked();
							}
						}, {
							text : '删除',
							id : 'tbi_del',
							iconCls : 'deleteIcon',
							disabled : true,
							handler : function() {
								btnsc_clicked();
							}
						}, '->', {
							text : '刷新',
							iconCls : 'arrow_refreshIcon',
							handler : function() {
								qGridStore.reload();
							}
						}]
			});

			
	 var qGridPanel = new Ext.grid.GridPanel({
			// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
			title : '<span class="commoncss">Api类目表</span>',
			height : 500,
			id : 'id_grid_apiCategory',
			autoScroll : true,
			frame : true,
			region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
			store : qGridStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : qGridColumns, // 列模型
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
				
			
			// 监听行选中事件
	 qGridPanel.on('rowclick', function(pGrid, rowIndex, event) {
				Ext.getCmp('tbi_edit').enable();
				Ext.getCmp('tbi_del').enable();
			});

	 qGridPanel.on('rowdblclick', function(grid, rowIndex, event) {
				btnxg_clicked();
			});
			
				
				
				
	// 申请明细窗体各个控件
	   var eapicategoryid = new Ext.form.Hidden({
		      id			: 'id_eapicategoryid',
		      name		    : 'apicategoryid'
	       });
	   var eapisystemid = new Ext.form.ComboBox({
			id            : 'id_eapisystemid',
			hiddenName : 'apisystemid', // 往后台传值字段名
			store : OPENAPIStore, // 引用的代码表数据源和<G4Studio:ext.codeStore
									// />标签对应
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '', // 初始选中的列表项
			fieldLabel : '所属系统',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true, // 选中内容必须为下拉列表的子项
			editable : true, // 选择输入框可编辑
			typeAhead : true, // 输入的时候自动匹配待选项目
			labelStyle    : micolor,
			anchor : '100%'
		});      
       var eapicategoryname = new Ext.form.TextField({
	          id            : 'id_eapicategoryname',
		      name          : 'apicategoryname',
		      fieldLabel    : '类别名称',
		      allowBlank	: false,
		      labelStyle    : micolor,
		      maxLength	    : 50,
		      selectOnFocus : true,
		      anchor        : '99%'
	       }); 	
       var esortno = new Ext.form.TextField({
	          id            : 'id_esortno',
		      name          : 'sortno',
		      fieldLabel    : '序列号',
		      allowBlank	: false,
		      labelStyle    : micolor,
		      maxLength	    : 50,
		      selectOnFocus : true,
		      anchor        : '99%'
	       }); 	       
		
				

	var eFormPanel = new Ext.form.FormPanel({
	    id : 'id_eapiCategoryFormPanel',
	    name : 'eapiCategoryFormPanel',
	    defaultType : 'textfield',
	    labelAlign : 'right',
	    labelWidth : 60,
	    frame : false,
	    bodyStyle : 'padding:5 5 0',
		items         : [
				eapicategoryid
				,
				eapisystemid
				,
				eapicategoryname
				,
				esortno
				
		]
	});
				
		// 申请明细窗体
	var eWindow = new Ext.Window({
		layout : 'fit',
		width : 400,
		height : 215,
		resizable : false,
		draggable : true,
		closeAction : 'hide',
		modal : true,
		title : '<span class="commoncss">窗口标题</span>',
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
		items : [eFormPanel],
		buttons : [{
			text : '保存',
			iconCls : 'acceptIcon',
			handler : function() {
				if (runMode == '0') {
					Ext.Msg.alert('提示',
							'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				btnbc_clicked()
			}
		}, {
			text : '重置',
			id : 'btnReset',
			iconCls : 'tbar_synchronizeIcon',
			handler : function() {
				clearForm(eFormPanel.getForm());
			}
		}, {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				eWindow.hide();
			}
		}]
	});
				
				
							
	// 布局
	// 如果把form作为center区域的话,其Height属性将失效。
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [qFormPanel, qGridPanel]
			});	
				
			
	/**
	 * 查询列表
	 */
	function btncx_clicked(){
		var params = qFormPanel.getForm().getValues();
		params.start = 0;
		params.limit = bbar.pageSize;
		qGridStore.load({
					params : params
				});
	}
	
	btncx_clicked();
	
	// 保存
	function btnbc_clicked(){
			  if (!eFormPanel.getForm().isValid())
			     return;
			     
			  	var execmethod = '';
			    if(eapicategoryid.getValue() == ''){
					execmethod = 'save.do';
				}else{
					execmethod = 'update.do';
				};
			  	
			  	eFormPanel.form.submit({
					url : './ApiCategory/'+execmethod,
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) { // 回调函数有2个参数
						eWindow.hide();
						qGridStore.reload();
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						Ext.Msg
								.alert('提示', '操作Api类目表信息失败! <BR>请确认您已经登录, 且网络保持畅通!'
												+ action.result.msg);
					}
				});
		　}
			
			
			
	// 新增界面
	function btnxz_clicked(){
		eWindow.setTitle('新增Api类目表信息');
			eapicategoryid.setValue('');
			eapisystemid.setValue('');
			eapicategoryname.setValue('');
			esortno.setValue('');
		eWindow.show();
				
	}
			
	// 修改界面
	function btnxg_clicked(){
		var record = qGridPanel.getSelectionModel().getSelected();
		if(!record){
			Ext.MessageBox.alert('提示', '请选择要修改的Api类目表信息');
		}
		else{
			eWindow.setTitle('修改Api类目表信息');
			eFormPanel.getForm().loadRecord(record);
			eWindow.show();
		};
	};

				
	// 删除操作
	function btnsc_clicked() {
		var rows = qGridPanel.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的项目!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'apicategoryid');
		Ext.Msg.confirm(
						'请确认',
						'<span style="color:red"><b>提示:</b>删除Api类目表信息,请慎重.</span><br>继续删除吗?',
						function(btn, text) {
							if (btn == 'yes') {
								if (runMode == '0') {
									Ext.Msg
											.alert('提示',
													'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
									return;
								}
								showWaitMsg();
								Ext.Ajax.request({
									url : './ApiCategory/delete.do',
									success : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										qGridStore.reload();
										Ext.Msg.alert('提示', resultArray.msg);
									},
									failure : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										Ext.Msg.alert('提示', resultArray.msg);
									},
									params : {
										strChecked : strChecked
									}
								});
							}
						});
	}
			
});


