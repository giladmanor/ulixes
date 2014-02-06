class Language < ActiveRecord::Base
  belongs_to :account
  
  to_info :name, :code
  
  
end
