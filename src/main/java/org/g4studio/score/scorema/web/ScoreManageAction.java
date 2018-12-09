package org.g4studio.score.scorema.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Utils;
import org.g4studio.score.service.ScoreService;
import org.g4studio.system.admin.service.OrganizationService;

public class ScoreManageAction extends BaseAction {
	
	private ScoreService scoreService = (ScoreService) super.getService("scoreService");
	  
	public ActionForward scoreInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	
		List list = scoreService.getScoreInfo();
		int pageCount=20;
		String jsonString = encodeList2PageJson(list, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	public ActionForward saveScore(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (!isDemoMode(response)) {
			scoreService.saveScoreItem(inDto);
			setOkTipMsg("成绩数据新增成功", response);
		}
		
		return mapping.findForward(null);
	}
	public ActionForward updateScore(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		if (!isDemoMode(response)) {
			scoreService.updateScoreItem(inDto);
			setOkTipMsg("成绩数据修改成功", response);
		}
		
		return mapping.findForward(null);
	}
	public ActionForward queryScoreByName(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		BaseActionForm aForm = (BaseActionForm)form;
		Dto dto = aForm.getParamAsDto(request);
	    List list = scoreService.queryScoreByName(dto);
		int pageCount=20;
		String jsonString = encodeList2PageJson(list, pageCount, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}
	
	

}
