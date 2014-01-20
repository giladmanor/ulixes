class Notification < ActiveRecord::Base
  belongs_to :account
  validates_uniqueness_of :name, :scope => [:account_id], :message => "Name taken"
  to_info :name, :format, :multilang
  serialize :data, Array
  
  def format_types
    [["Mail Message",:email],["Web Message",:web],["SMS",:sms],["Twitter",:twitter]]
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
    #TODO: embed dynamic data
  end
  
  def message_by_lang(lang)
    self.data.select{|m| m["lang"]==lang}.first || self.data.first
  end
  
end
