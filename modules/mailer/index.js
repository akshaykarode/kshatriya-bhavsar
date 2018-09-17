var mailConfig = require('./../../configs/mail-config'),
		swig = require('swig'),
		path = require('path'),
		nodemailer = require('nodemailer'),
    moment =  require('moment')

var smtpConfig = {
  pool: true,
  secure:true,
  service:'SES-US-EAST-1',
  // host: mailConfig.host,
  // port: mailConfig.port,
  auth: {
    user: mailConfig.smtp_username,
    pass: mailConfig.smtp_password
  }
}
var mailOptions = {
  from: '"Sender Name" <no-reply@my-planner.in>', // sender address
  to: '', // list of receivers
  subject: '', // Subject line
  replyTo: '',
  html: '' // html body
}
var transporter = nodemailer.createTransport(smtpConfig)

module.exports = {
	
  sendMail : function(mailOptions){
    console.log('sendMail...')
		transporter.sendMail(mailOptions,function(err, success) {
		  if(err) console.log('err',err)
		  if(!err) console.log('success',success)
		})
	},
	sendPurchaseMail : function(nseRequest,nseResponse){
    var that=this;
    console.log('sendPurchaseMail...')
    var template = swig.compileFile(path.join(__dirname,'./../../views/email-templates/purchase.html')); // swig.compileFile('views/email-templates/purchase.html');
    var _meta = {}
    var _order_date = new Date(nseRequest.extras.order_date)
        _order_date.setHours(_order_date.getHours()+5)
        _order_date.setMinutes(_order_date.getMinutes()+30)
    var _nseResponse = (Object.prototype.toString.call(nseResponse) === '[object Array]')? nseResponse : [nseResponse]
    _nseResponse.forEach(function(o){
    	o.link = (typeof o.Paymentlink!="undefined")?
      	o.Paymentlink.match(/http([^\'\"]+)/)[0] : ""; // pull payment link from junk
    })
    var bankObject = _.find(db._BANKS,{bank_code:nseRequest.data.bank})
    _meta.expiresIn = moment(_order_date).add(48, 'h').format('D MMM YYYY h:mm A')
    _meta.totalInvestment = nseRequest.data.instrm_amount
    _meta.bankFullName = (bankObject) ? bankObject.bank_name : nseRequest.data.bank;
    var output = template({
			'nseRequest':nseRequest,
			'nseResponse': _nseResponse,
			'_meta':_meta
		})
    /* Get Verified Email */
    db.getVerifiedEmail(nseRequest.extras.admin_advisor_id)
    .then(function(result){
      var awsve=result[0] || {}
      var options = mailOptions
      options.from = '"'+(awsve.from_name || nseRequest.extras.advisor_name)+'" <'+(awsve.email_id || 'transactions@my-planner.in')+'>'
      options.to = nseRequest.extras.email // nseRequest.extras.email || ""
      options.cc = nseRequest.extras.advisor_email
      // options.bcc = 'akshay@futurewise.co.in'
      options.subject = 'Authorization Required for Mutual Fund Purchase' 
  		options.html = output
  		that.sendMail(options)
    })
	},
	sendSIPMail : function(nseRequest,nseResponse){
    console.log('sendSIPMail...')
    var template = swig.compileFile(path.join(__dirname,'./../../views/email-templates/sip.html'));
    var _meta = {},that=this;
    var _order_date = new Date(nseRequest.extras.order_date)
        _order_date.setHours(_order_date.getHours()+5)
        _order_date.setMinutes(_order_date.getMinutes()+30)
    var _nseResponse = (Object.prototype.toString.call(nseResponse) === '[object Array]')? nseResponse : [nseResponse]
    _nseResponse.forEach(function(o,i){
      o.link = (typeof o.Paymentlink!="undefined")?
        o.Paymentlink.match(/http([^\'\"]+)/)[0] : ""; // pull payment link from junk
      var from = nseRequest.transactions[i].from_date || nseRequest.transactions[i].sip_from_date
      var to = nseRequest.transactions[i].to_date || nseRequest.transactions[i].sip_end_date
      var frq = nseRequest.transactions[i].sip_freq || nseRequest.transactions[i].periodicity
      o.sip_start = moment(new Date(from)).format('D MMM YYYY')
      o.sip_end = (nseRequest.transactions[i].until_cancelled=="Y")?
        "until cancelled" : moment(new Date(to)).format('D MMM YYYY')
      o.frequency = that.getFrequency(frq)
    })
    var bankObject = _.find(db._BANKS,{bank_code:nseRequest.data.bank})
    _meta.expiresIn = moment(_order_date).add(48, 'h').format('D MMM YYYY h:mm A')
    _meta.totalInvestment = nseRequest.data.instrm_amount
    _meta.bankFullName = (bankObject) ? bankObject.bank_name : nseRequest.data.bank;
    var output = template({
      'nseRequest':nseRequest,
      'nseResponse': _nseResponse,
      '_meta':_meta
    })
    /* Get Verified Email */
    db.getVerifiedEmail(nseRequest.extras.admin_advisor_id)
    .then(function(result){
      var awsve=result[0] || {}
      var options = mailOptions
      options.from = '"'+(awsve.from_name || nseRequest.extras.advisor_name)+'" <'+(awsve.email_id || 'transactions@my-planner.in')+'>'
      options.to = nseRequest.extras.email // nseRequest.extras.email || ""
      options.cc = nseRequest.extras.advisor_email
      // options.bcc = 'akshay@futurewise.co.in'
      options.subject = 'Authorization Required for Mutual Fund SIP' 
      options.html = output
      that.sendMail(options)
    })
  },
  getFrequency : function(code){
  	var value = ""
  	switch(code){
			case "DZ":{value = "Daily"; break;}
			case "OW":{value = "Weekly"; break;}
			case "OM":{value = "Monthly"; break;}
			case "Q":{value = "Quarterly"; break;}
			case "Y":{value = "Yearly"; break;}
			case "FM":{value = "Fortnightly"; break;}
			case "H":{value = "Half Yearly"; break;}
			case "TM":{value = "Twice a Month"; break;}
		}
		return value;
  }

}