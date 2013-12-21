class Node < ActiveRecord::Base
  has_many :rules
  has_many :edges, :class_name=>"Edge", :foreign_key=>"source_id"
  
  
  def all_rules
    self.rules
  end
  
  
  
  
end
