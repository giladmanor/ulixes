class User < ActiveRecord::Base
  acts_as_tree
  belongs_to :account
  belongs_to :role
  has_many :events
  
  
  
  def spill
  
  end
  
  def resolve_event(code,value)
    self.events << Event.create(:code=>code, :value=>value)
  end
  
  
  
  
end
