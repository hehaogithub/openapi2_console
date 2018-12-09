package org.g4studio.score.service;

import java.util.List;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface ScoreService extends BaseService{
    /**
	 * 获取所有成绩信息
	 * @param pDto
	 * @return List
	 */
	public List getScoreInfo();
	 /**
	 * 保存成绩信息
	 * @param pDto
	 * @return Dto
	 */
	public Dto saveScoreItem(Dto pDto);
	
	/**
	 * 修改成绩信息
	 * @param pDto
	 * @return
	 */
	public Dto updateScoreItem(Dto pDto);
	
	/**
	 * 根据姓名查询成绩信息
	 * @param 无
	 * @return
	 */
	public List queryScoreByName(Dto pDto);

}
