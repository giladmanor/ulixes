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
      elsif self.respond_to?("__acts_as_image") && __acts_as_image==field_name
        res[:type] = "image"
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
        
        def self.__acts_as_image
          "#{field_name}"
        end
        
        def upload_image upload
          file =  "\#{self.id\}.\#{upload.original_filename.split('.').last\}"
          self.#{field_name} = "/repository/#{self.name}/" + file
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
      params.each{|k,v| 
        if self.respond_to?(k.to_sym)
          v = eval v.to_s if self.serialized_attributes[k]
          self.update_attribute(k,v)
        end
      }
      if params[:upload].present? && self.respond_to?(:upload_image)
        self.upload_image params[:upload]
        self.save
      end
      
    end
  end
end

ActiveRecord::Base.send(:include, Magic)

#Account.reflect_on_all_associations(:has_many).first