class Importer
  
  def imp
    @config = YAML.load_file("#{Rails.root}/config/import_config.yml")
  end
  
  def init
    @config.each{|source|
      puts "Accessing #{source.first}"
      source = source[1]
      res = get_result_set(source["driver"], source["connection"],source["query"])
      process(res,source["field_set"],source["uid"])
    }
  end
  
  
  def get_result_set(driver, connData)
    puts driver
    puts connData
  end
  
  def process(result_set,conversion_map,uid_field)
    result_set.each{|row|
      uid = row[uid_field]
      user = @account.find_user(uid)
      conversion_map.each{|code|
        value = row[code]
        user.resolve_event(code,value)
      }
    }
  end
  
  
end