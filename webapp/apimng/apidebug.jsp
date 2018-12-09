<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<G4Studio:html title="Api命令调试管理(apidebug)">
<G4Studio:import src="/apimng/js/apidebug.js" />
<G4Studio:ext.codeRender fields="SEX,LOCKED,USERTYPE,HTTPMETHOD,RETURNFORMAT,ISMUST,OPENAPI"/>
<G4Studio:ext.codeStore fields="SEX,LOCKED,USERTYPE:3,HTTPMETHOD,RETURNFORMAT,ISMUST,OPENAPI"/>
<G4Studio:body>
</G4Studio:body>
<G4Studio:script>
   var apiSystemid = '<G4Studio:out key="apiSystemid" scope="request"/>';
</G4Studio:script>
<G4Studio:ext.uiGrant/>
</G4Studio:html>

