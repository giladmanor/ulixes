module Magic

  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods

    def to_info *options 
      s = options.map{|v| ":#{v}=>self.#{v.to_s}"}
      puts s.join(",")
      
      class_eval <<-EB
        def to_info
          {#{s.join(",")}}
        end
        
        def self.to_info_keys 
          #{options}
        end
      
      EB
      
    end
    
    

  end

  
  module InstanceMethods
    
  end
end


ActiveRecord::Base.send(:include, Magic)



#Account.reflect_on_all_associations(:has_many).first