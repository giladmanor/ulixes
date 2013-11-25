require 'fileutils'
module Magic
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def describe(field_name)
      res = {}

      if field_name.include?("_id")
        t = self.reflect_on_association(field_name.gsub("_id", "").to_sym)
        res[:type] = t.macro
        res[:entity] = t.options[:class_name].constantize
      elsif t = self.serialized_attributes[field_name]
        res[:type] = t.object_class.name
        res[:structure] = self.call("#{field_name}_structure") if self.respond_to?("#{field_name}_structure")
      else
        res[:type] = self.column_types[field_name].type
      end
      res
    end
    
    def acts_as_image field_name, separator_field
      
      rep_dir = "#{Rails.root}/public/repository/#{self.name}/"
      FileUtils.mkdir_p rep_dir
      
      
      class_eval <<-EB
        include Magic::InstanceMethods
        def upload_image upload
          file =  "\#{self.id\}.\#{file_suffix(upload.original_filename)\}"
          self.#{field_name} = file
          path = File.join("#{rep_dir}", "\#{file\}")
          # write the file
          File.open(path, "wb") { |f| f.write(upload.read) }
          self.save
        end
        
        def image_uri
          self.#{field_name}
        end
        
        def self.galeries(id)
          #{self.name}.all.where(:account_id=>id).map{|i| i.#{separator_field}}.uniq.sort
        end
        
        def self.galery(id, separator)
          #{self.name}.all.where(:account_id=>id, :#{separator_field.to_sym}=>separator)
        end

      EB
      
    end

    def serialized_columns(field, columns_and_options)
      class_eval <<-EB
        include Magic::InstanceMethods
        def #{field}_structure
          {#{columns_and_options}}
        end

      EB
    end
    
    def to_label value
      class_eval <<-EB
        include Magic::InstanceMethods
        def to_label
          #{value}
        end
      EB
    end

    def to_info *options
      s = options.map{|v| ":#{v}=>self.#{v.to_s}"}
      #puts s.join(",")

      class_eval <<-EB
        include Magic::InstanceMethods
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
    def set(params)
      params.delete_if{|k,v| !self.respond_to?(k.to_sym)}
      params.each{|k,v| 
        if self.serialized_attributes[k]
          v = eval v.to_s
        end
        self.update_attribute(k,v)
      }
    end
  end
end

ActiveRecord::Base.send(:include, Magic)

#Account.reflect_on_all_associations(:has_many).first