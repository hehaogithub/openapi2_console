package org.g4studio.score.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.score.service.ScoreService;
import org.g4studio.system.common.dao.vo.UserInfoVo;
import org.g4studio.system.common.util.SystemConstants;

public class ScoreServiceImpl extends BaseServiceImpl implements ScoreService  {

	@Override
	public List getScoreInfo() {
	  List list = g4Dao.queryForList("Score.queryScoreInit");
		System.out.println(list);
		return list;
		
	}

	@Override
	public Dto saveScoreItem(Dto pDto) {
		g4Dao.insert("Score.insertScore", pDto);
		return null;
	}

	@Override
	public Dto updateScoreItem(Dto pDto) {
		g4Dao.update("Score.updateScore", pDto);
		return null;
	}

	@Override
	public List queryScoreByName(Dto pDto) {
		 List list = g4Dao.queryForList("Score.queryScoreByName",pDto);
		 return list;
	}
	

}
