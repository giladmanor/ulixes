account = Account.find 1

10.times{|i|
offer = Offer.create({account: account,ext_id:"asdfghjk", data:{}})  
  
  }


