class Importer
  
  def yml(account)
    @config = YAML.load_file("#{Rails.root}/config/import_config.yml.ignore")
    @account = account
  end
  
  def init
    @config.each{|source|
      puts "Accessing #{source.first}"
      source = source[1]
      res = get_result_set(source["driver"], source["connection"],source["query"])
      process(res,source["field_set"],source["uid"])
    }
  end
  
  
  def get_result_set(driver, conn_data, query)
    conn =  conn_data.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
    client = TinyTds::Client.new(conn) if driver == "sqlserver" 
    client.execute(query)
  end
  
  def process(result_set,conversion_map,uid_field)
    
    result_set.each{|row|
      uid = row[uid_field]
      user = @account.find_user(uid.to_s)
      
      conversion_map.each{|k,v|
        if v=="dim"
          puts "resolve dim #{row[k]}"
          user.resolve_event(row[k].strip,"1")
        elsif v=="val"
          puts "resolve val #{k} #{row[k]}"
          user.resolve_event(k,row[k].to_s.strip)
        end
        
      }
    }
  end
  
  
end