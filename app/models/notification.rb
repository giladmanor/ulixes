class Notification < ActiveRecord::Base
  belongs_to :account
  validates_uniqueness_of :name, :scope => [:account_id], :message => "Name taken"
  to_info :name, :format, :multilang
  serialize :data, Array
  
  def format_types
    [["Web Message",:web],["Video Message",:video],["Call To Action",:cta],["Mail Message",:email],["SMS",:sms],["Twitter",:twitter]]
  end
  
  def format_label
    begin 
      self.format_types.select{|i| i.last==self.format.to_sym}.first.first
    rescue
      "Undefined"
    end
  end
  
  def reduce(user)
    message = message_by_lang(user.local) 
    if self.format == "cta"
      message = cta_wrapper.gsub("[:NOTIFICATION_ID]",self.id.to_s).gsub("[:MESSAGE]",message)
    end
    
    message
    #TODO: embed dynamic data
  end
  
  def message_by_lang(lang)
    self.data.select{|m| m["lang"]==lang}.first || self.data.first
  end
  
  
  def cta_wrapper
    res = <<MESSAGE_END
<form accept-charset="UTF-8" action="" class="form" method="post" onsubmit="ulixes.set_response($(this));return false;" role="form"> 
<input type="hidden" name="notification_id" value="[:NOTIFICATION_ID]"/>
[:MESSAGE]
</form>
MESSAGE_END
    
  end
  
end
