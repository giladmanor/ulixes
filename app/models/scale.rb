class Scale < ActiveRecord::Base
  belongs_to :account
  to_info :name, :code, :limitted
  
  
  def limitted
    self.upper_limit.nil? ? "Unlimitted" : self.upper_limit.to_s
  end
  
  
  
  
  
end
