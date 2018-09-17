#!/usr/bin/python3
#Author = 'Akshay'
import sys
import os

###Configuration###
try :
	#APP_DIR='/home/akshay/Desktop/transaction-platform'
	CONF={'ROLLBACK':False,'REVISION':'none','PROCESS_ID':0}
	GIT_URL='https://akshay_futurewise@bitbucket.org/akshay_futurewise/moneymanager-transaction-platform.git';

	cmdargs=str(sys.argv)
	for i in range(len(sys.argv)) :
		if (i==0) :
			continue;
		else :
			arg=str(sys.argv[i]).split("=")
			CONF[arg[0]]=arg[1]

	print ('CONF : ',CONF)

except Exception :
	print("Some Exception in Configuration: ",str(Exception))
	print("Script exiting forcefully ...")
	sys.exit();

###Automation steps###
try :

	os.chdir(CONF['APP_DIR'])
	print ("cd",CONF['APP_DIR'])
	os.system('sudo git checkout master')
	print ("sudo git checkout master")

	if (CONF['ROLLBACK'] == 'true' and CONF['REVISION'] == 'none') :
		CONF['REVISION'] = raw_input('Please enter rollback revision : ')
		os.system('sudo git checkout %s' %CONF['REVISION'])
		print ("sudo git checkout",CONF['REVISION'])
	else :
		print ("sudo git pull origin master")
		os.system('sudo git pull origin master')
		if (CONF['REVISION'] != 'none') :
			os.system('sudo git checkout %s' %CONF['REVISION'])
			print ("sudo git checkout",CONF['REVISION'])

except Exception :
	print("Some Exception in Automation steps: ",str(Exception))
	print("Script exiting forcefully ...")
	sys.exit();

###Server Restart###
try :
	print ("pm2 restart",CONF['PROCESS_ID'])
	os.system('pm2 restart %s' %CONF['PROCESS_ID'])
	os.system('pm2 show %s' %CONF['PROCESS_ID'])
except Exception :
	print("Some Exception in Server Start steps: ",str(Exception))
	print("Script exiting forcefully ...")
	sys.exit();