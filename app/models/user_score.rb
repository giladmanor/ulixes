class UserScore < ActiveRecord::Base
  belongs_to :user
  belongs_to :scale
  
  to_info :name, :value
  
  def name
    self.scale.code
  end
  
end
