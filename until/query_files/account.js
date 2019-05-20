module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectUserDept":
			_SQLCommand += "SELECT UD_DEPT AS 'SUD_DEPT' \
						    FROM USER_DEPT \
						    WHERE 1=1 ";

			if(pParams["UD_ID"] !== undefined){
				_SQLCommand += " AND UD_ID = @UD_ID ";
			}
			break;
		case "SelectSysUserGrade":
			_SQLCommand += "SELECT SUG_GRADE, \
								   SUG_NAME \
						    FROM SYS_USER_GRADE \
						    WHERE 1=1 ";

			if(pParams["SUG_STS"] !== undefined){
				_SQLCommand += " AND SUG_STS = @SUG_STS ";
			}

			_SQLCommand += " ORDER BY SUG_GRADE ASC ";
			break;
		case "SelectSysUserDept":
			_SQLCommand += "SELECT SUD_DEPT, \
								   SUD_DLVL, \
								   SUD_DPATH, \
								   SUD_NAME \
							FROM SYS_USER_DEPT \
						    WHERE 1=1 ";

			if(pParams["SUD_STS"] !== undefined){
				_SQLCommand += " AND SUD_STS = @SUD_STS ";
			}

			_SQLCommand += " ORDER BY SUD_DLVL ASC, SUD_DEPT ASC ";
			break;
	}

	return _SQLCommand;
};